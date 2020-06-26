export interface IUserFormsActions {
  getStaticData(file: string): any;
  postLogin(form: FormData, loginURL: string): Promise<any>;
  postContactUs(form: FormData, contactURL: string): Promise<any>;
  postRegister(form: FormData, registerURL: string): Promise<any>;
}

export type IUserFormsActionsType = IUserFormsActions;
