class AuthManager {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async login(email, password) {
    try {
      const response = await this.apiService.login(email, password);
      this.setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  setUser(user) {
    localStorage.setItem('molatech_token', user.token);
    localStorage.setItem('molatech_user', user.name);
    localStorage.setItem('molatech_email', user.email);
  }

  getUser() {
    return {
      token: localStorage.getItem('molatech_token'),
      name: localStorage.getItem('molatech_user'),
      email: localStorage.getItem('molatech_email')
    };
  }

  isAuthenticated() {
    return !!localStorage.getItem('molatech_token');
  }

  logout() {
    localStorage.removeItem('molatech_token');
    localStorage.removeItem('molatech_user');
    localStorage.removeItem('molatech_email');
  }

  redirectIfNotAuthenticated() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
    }
  }

  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      window.location.href = 'dashboard.html';
    }
  }
}
