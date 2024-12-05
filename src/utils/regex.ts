export const Regex = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  password:
    /^(?=.*[A-Za-z])(?=.*[!?@#$%~+\-=:;_^&*\\|"`'])[A-Za-z\d!?@#$%~+\-=:;_^&*\\|"`']{6,}$/,
  mobile:
    /^((?:(010-[0-9]{4})|(01[1|6|7|8|9]-[0-9]{3,4}))-([0-9]{4}))$|((010[0-9]{8})|(01[1|6|7|8|9][0-9]{7,8}))$/,
  mobile2: /^((?:(010-[0-9]{4})|(01[1|6|7|8|9]-[0-9]{3,4}))-([0-9]{4}))/,
};
