package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"cch.local/backend/internal/modules/complaints"
)

const insertComplaintSQL = `INSERT INTO cchentri (
	ID_Pengaduan,
	Nama_Pelanggan,
	Email_Pelanggan,
	Telepon_Pelanggan,
	Alamat_Pelanggan,
	Kantor_Asal,
	Kantor_Tujuan,
	Kantor_Tembusan,
	Semua_Tujuan,
	Jenis_Aduan,
	Sumber_Aduan,
	Jenis_Kiriman,
	Nomor_Kiriman,
	Tanggal_Pengaduan,
	Kantor_Asal_Kiriman,
	Kantor_Tujuan_Kiriman,
	Ringkasan_Pengaduan,
	Uraian_Pengaduan,
	Status_Akhir,
	Tanggal_Status,
	Kantor_Status,
	Tanggal_Tambah,
	Ditambah_Oleh,
	Diubah_Oleh,
	Tanggal_Ubah
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

const insertComplaintHistorySQL = `INSERT INTO cchentrimas (
	ID_Pengaduan,
	Status_Update,
	Kantor_Asal_Update,
	Deskripsi_Update,
	Tanggal_Update,
	Petugas_Update,
	Durasi_Antar_Status
) VALUES (?, ?, ?, ?, ?, ?, ?)`

// CreateComplaint creates a new complaint in the database
func (repository *MySQLComplaintRepository) CreateComplaint(ctx context.Context, cmd complaints.CreateComplaintCommand) (complaints.CreateComplaintResult, error) {
	if repository == nil || repository.db == nil {
		return complaints.CreateComplaintResult{}, ErrRepositoryNotConfigured
	}

	// Generate complaint ID (format: CCH-YYYYMMDD-XXXXX)
	now := time.Now()
	complaintID, err := generateComplaintID(ctx, repository.db, now)
	if err != nil {
		return complaints.CreateComplaintResult{}, fmt.Errorf("generate complaint ID: %w", err)
	}

	// Initial status for new complaints (101 = Diterima/Received)
	initialStatus := "101"
	initialStatusDescription := "Pengaduan diterima dan sedang diproses"

	// Determine routing: origin is creating office, targets based on shipment
	originOffice := cmd.CreatingOfficeCode
	destinationOffice := cmd.ShipmentTargetOffice
	if destinationOffice == "" {
		destinationOffice = originOffice // Default to same office if no target specified
	}

	// Set copy offices and all targets (for now, keep simple)
	copyOffices := ""
	allTargets := destinationOffice
	if destinationOffice != originOffice {
		allTargets = fmt.Sprintf("%s,%s", destinationOffice, originOffice)
	}

	// Shipment origin office defaults to creating office if not specified
	shipmentOriginOffice := cmd.ShipmentOriginOffice
	if shipmentOriginOffice == "" {
		shipmentOriginOffice = originOffice
	}

	// Start transaction
	tx, err := repository.db.BeginTx(ctx, nil)
	if err != nil {
		return complaints.CreateComplaintResult{}, fmt.Errorf("begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Insert main complaint record
	_, err = tx.ExecContext(ctx, insertComplaintSQL,
		complaintID,                  // ID_Pengaduan
		cmd.CustomerName,             // Nama_Pelanggan
		cmd.CustomerEmail,            // Email_Pelanggan
		cmd.CustomerPhone,            // Telepon_Pelanggan
		cmd.CustomerAddress,          // Alamat_Pelanggan
		originOffice,                 // Kantor_Asal
		destinationOffice,            // Kantor_Tujuan
		copyOffices,                  // Kantor_Tembusan
		allTargets,                   // Semua_Tujuan
		cmd.ComplaintTypeCode,        // Jenis_Aduan
		cmd.ComplaintSourceCode,      // Sumber_Aduan
		cmd.ShipmentTypeCode,         // Jenis_Kiriman
		cmd.ShipmentNumber,           // Nomor_Kiriman
		now,                          // Tanggal_Pengaduan
		shipmentOriginOffice,         // Kantor_Asal_Kiriman
		cmd.ShipmentTargetOffice,     // Kantor_Tujuan_Kiriman
		cmd.Summary,                  // Ringkasan_Pengaduan
		cmd.Description,              // Uraian_Pengaduan
		initialStatus,                // Status_Akhir
		now,                          // Tanggal_Status
		originOffice,                 // Kantor_Status
		now,                          // Tanggal_Tambah
		cmd.CreatingUsername,         // Ditambah_Oleh
		cmd.CreatingUsername,         // Diubah_Oleh
		now,                          // Tanggal_Ubah
	)
	if err != nil {
		return complaints.CreateComplaintResult{}, fmt.Errorf("insert complaint: %w", err)
	}

	// Insert initial status history
	_, err = tx.ExecContext(ctx, insertComplaintHistorySQL,
		complaintID,                // ID_Pengaduan
		initialStatus,              // Status_Update
		originOffice,               // Kantor_Asal_Update
		initialStatusDescription,   // Deskripsi_Update
		now,                        // Tanggal_Update
		cmd.CreatingUsername,       // Petugas_Update
		0,                          // Durasi_Antar_Status (0 for initial status)
	)
	if err != nil {
		return complaints.CreateComplaintResult{}, fmt.Errorf("insert initial history: %w", err)
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		return complaints.CreateComplaintResult{}, fmt.Errorf("commit transaction: %w", err)
	}

	return complaints.CreateComplaintResult{
		ComplaintID:   complaintID,
		CreatedAt:     now,
		InitialStatus: initialStatus,
	}, nil
}

// generateComplaintID generates a unique complaint ID with format: CCH-YYYYMMDD-XXXXX
func generateComplaintID(ctx context.Context, db *sql.DB, timestamp time.Time) (string, error) {
	datePrefix := timestamp.Format("20060102") // YYYYMMDD format
	prefix := "CCH-" + datePrefix + "-"

	// Find the latest ID for today
	var lastSequence sql.NullInt64
	query := `SELECT MAX(CAST(SUBSTRING(ID_Pengaduan, 14) AS UNSIGNED)) 
	          FROM cchentri 
	          WHERE ID_Pengaduan LIKE ?`
	err := db.QueryRowContext(ctx, query, prefix+"%").Scan(&lastSequence)
	if err != nil && err != sql.ErrNoRows {
		return "", fmt.Errorf("query last sequence: %w", err)
	}

	// Increment sequence
	nextSequence := int64(1)
	if lastSequence.Valid {
		nextSequence = lastSequence.Int64 + 1
	}

	// Format: CCH-YYYYMMDD-00001
	complaintID := fmt.Sprintf("%s%05d", prefix, nextSequence)
	return complaintID, nil
}

// sanitizeField removes dangerous characters from user input
func sanitizeField(input string) string {
	// Remove control characters and dangerous SQL-ish characters
	replacer := strings.NewReplacer(
		"\x00", "",
		"\r", "",
		"\n", " ",
		"\t", " ",
	)
	return replacer.Replace(input)
}
