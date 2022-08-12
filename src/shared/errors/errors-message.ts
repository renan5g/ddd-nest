export const ErrorMessages = {
  INVALID_PARAM: (param: string, value: string) =>
    `O ${param} ${value} é invalido`,
  INVALID_PASSWORD: 'A senha deve ter entre 6 e 255 caracteres.',
  USER_DOES_NOT_EXIST: 'Usuário não existe!',
  INVALID_CREDENTIAL: 'E-mail e/ou senha são inválidos!',
  USER_ALREADY_EXIST: 'Usuário já registrado!',
};
