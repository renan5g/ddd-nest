export const ErrorMessages = {
  INVALID_PARAM: (param: string, value: string) =>
    `O ${param} ${value} é invalido`,
  USER_DOES_NOT_EXIST: 'Usuário não existe!',
  INVALID_PASSWORD:
    'Senha não pode ser menor que 8 caracteres ou maior que 255',
  INVALID_CREDENTIAL: 'E-mail e/ou senha são inválidos!',
  USER_ALREADY_EXIST: 'Usuário já registrado!',
  INVALID_ENUM_MANGA_STATUS: 'Status de mangá invalido',
  INVALID_ENUM_MANGA_TYPE: 'Typo de mangá invalido',
  INVALID_CREDENTIALS: 'Invalid Credentials',
  MANGA_ALREADY_EXISTS: 'Manga já existe!',
  MANGA_DOES_NOT_EXISTS: 'Manga does not already exists!',
  CHAPTER_DOES_NOT_EXISTS: 'Chapter does not already exists!',
  CHAPTER_ALREADY_EXISTS: 'Chapter already exists!',
  TITLE_INVALID: 'Title is invalid!',
  GENRE_INVALID: 'Genre is invalid!',
  DESCRIPTION_INVALID: 'Description is invalid!',
  SCAN_NOT_FOUND: 'Scan does not exists!',
  SCAN_ALREADY_EXISTS: 'Scan already exists!',
  SCAN_NOT_PERMISSION: 'Scan is not allowed!',
};
