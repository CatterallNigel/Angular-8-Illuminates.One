export interface IUserFormsActions {
  getStaticData(file: string): any;
  postLogin(form: FormData, loginURL: string): Promise<{id: string} | string>;
  postContactUs(form: FormData, contactURL: string): Promise<string>;
  postRegister(form: FormData, registerURL: string): Promise<string>;
}

export type IUserFormsActionsType = IUserFormsActions;
