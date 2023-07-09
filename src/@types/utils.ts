import { ChangeEvent, FormEvent } from "react";

export type TAvatar = {
  url: string;
  publicId: string;
};

export interface IAuthCreds {
  email: string;
  password: string;
  username?: string;
  name?: string;
};

export type LoginProps = 'email' | 'password'
export interface LoginCredentials {
  email?: string;
  password?: string;
}

export type DefaultUserProps = "name" | "email" | "password" | "password2"

export type HandleInput<T> = (e: ChangeEvent<HTMLInputElement>, propId: T) => void

export type HandleSubmit = (body: FormEvent<HTMLFormElement>) => Promise<void>

export type SaveInput<T, P extends keyof T> = (prop: P, value: T[P]) => void

export type Register = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void

// Type for onClick event
export type TMouseEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>

export enum Pages {
  Profile,
  Tribe,
  NewTribe,
};
