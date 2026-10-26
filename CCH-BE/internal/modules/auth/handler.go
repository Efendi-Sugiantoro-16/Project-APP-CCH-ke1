package auth

import (
	"database/sql"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"cch.local/backend/internal/platform/authentication"
	"cch.local/backend/internal/platform/config"
)

// Handler handles authentication requests
type Handler struct {
	db        *sql.DB
	jwtIssuer string
	jwtSecret string
}

// NewHandler creates a new auth handler
func NewHandler(db *sql.DB, cfg *config.Settings) *Handler {
	return &Handler{
		db:        db,
		jwtIssuer: cfg.JWT.Issuer,
		jwtSecret: cfg.JWT.Secret,
	}
}

// Login handles production login with username and password
func (h *Handler) Login(c fiber.Ctx) error {
	var req LoginRequest

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Username dan password wajib diisi",
		})
	}

	// Query user from database
	var user struct {
		Username    string
		Password    string
		FirstName   string
		LastName    string
		Email       sql.NullString
		Office      sql.NullString
		UserLevel   string
		Activated   string
		Locked      string
	}

	query := `
		SELECT 
			Username,
			Password,
			First_Name,
			Last_Name,
			Email,
			Office,
			User_Level,
			Activated,
			Locked
		FROM cch_users
		WHERE Username = ?
		LIMIT 1
	`

	err := h.db.QueryRow(query, req.Username).Scan(
		&user.Username,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Office,
		&user.UserLevel,
		&user.Activated,
		&user.Locked,
	)

	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "Username atau password salah",
		})
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error: "Terjadi kesalahan saat login. Silakan coba lagi",
		})
	}

	// Check if account is activated
	if user.Activated != "Y" {
		return c.Status(fiber.StatusForbidden).JSON(ErrorResponse{
			Error: "Akun Anda belum diaktifkan. Hubungi Admin IT untuk mengaktifkan akun",
		})
	}

	// Check if account is locked
	if user.Locked == "Y" {
		return c.Status(fiber.StatusForbidden).JSON(ErrorResponse{
			Error: "Akun Anda sedang terkunci. Hubungi Admin IT untuk membuka kunci akun",
		})
	}

	// Verify password
	// CCH uses PHP password_hash() which is bcrypt compatible
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "Username atau password salah",
		})
	}

	// Update last login time and status
	updateQuery := `
		UPDATE cch_users 
		SET Last_Login = ?, Current_Status = 'Login'
		WHERE Username = ?
	`
	_, err = h.db.Exec(updateQuery, time.Now(), user.Username)
	if err != nil {
		// Log error but don't fail login
		// TODO: Add proper logging
	}

	// Generate JWT token
	fullName := user.FirstName
	if user.LastName != "" {
		fullName = fullName + " " + user.LastName
	}

	claims := authentication.CCHClaims{
		Security: authentication.CCHSecurityClaims{
			Username:     user.Username,
			UserID:       user.Office.String,
			ParentUserID: "", // TODO: Get from user record if needed
			UserLevelID:  user.UserLevel,
			Permission:   524287, // ALLOW_ALL permission for authenticated users
		},
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    h.jwtIssuer,
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			ID:        authentication.GenerateJTI(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS512, claims)
	tokenString, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error: "Gagal membuat token autentikasi",
		})
	}

	// Return success response
	return c.Status(fiber.StatusOK).JSON(LoginResponse{
		Token: tokenString,
		User: UserInfo{
			Username:  user.Username,
			FullName:  fullName,
			Email:     user.Email.String,
			Office:    user.Office.String,
			Role:      "", // Role not in this table
			UserLevel: user.UserLevel,
			Activated: user.Activated,
			Locked:    user.Locked,
		},
		Message: "Login berhasil",
	})
}
