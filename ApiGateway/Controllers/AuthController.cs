using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api-gw/auth")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly string jwtKey = "CLAVE_SUPER_SECRETA_ACADEMICA_12345";

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        // 🔒 Validación simple (mock)
        if (dto.Usuario != "admin" || dto.Password != "1234")
            return Unauthorized("Credenciales inválidas");

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, dto.Usuario),
            new Claim(ClaimTypes.Role, "Admin")
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token)
        });
    }
}

public record LoginDto(string Usuario, string Password);
