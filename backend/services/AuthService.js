class AuthService {
  constructor(db) {
    this.db = db;
  }

  async authenticate(email, password) {
    const user = await this.db.getUserByEmail(email);
    
    if (!user) {
      throw new Error('Usuário ou senha inválidos');
    }

    if (user.password !== password) {
      throw new Error('Usuário ou senha inválidos');
    }

    return {
      token: 'molatech-token',
      name: user.name,
      email: user.email
    };
  }

  generateToken(user) {
    return {
      token: 'molatech-token',
      name: user.name,
      email: user.email
    };
  }
}

module.exports = AuthService;
