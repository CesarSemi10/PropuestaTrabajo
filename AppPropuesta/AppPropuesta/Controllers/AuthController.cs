using AppPropuesta.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using AppPropuesta.Data;

namespace AppPropuesta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _db;

        public AuthController(IConfiguration config, AppDbContext db)
        {
            _config = config;
            _db = db;
        }

        // Endpoint para registrar usuario seguro
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserLogin registro)
        {
            if (_db.Usuarios.Any(u => u.Username == registro.Username))
                return BadRequest("Usuario ya existe");

            var hash = BCrypt.Net.BCrypt.HashPassword(registro.Password);
            _db.Usuarios.Add(new Usuario
            {
                Username = registro.Username,
                PasswordHash = hash
            });
            await _db.SaveChangesAsync();
            return Ok("Usuario registrado exitosamente");
        }

        // Endpoint para login seguro
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLogin login)
        {
            var user = _db.Usuarios.FirstOrDefault(u => u.Username == login.Username);
            if (user != null && BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash))
            {
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, user.Username)
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(30),
                    signingCredentials: creds
                );
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
            }
            return Unauthorized();
        }
    }
}
