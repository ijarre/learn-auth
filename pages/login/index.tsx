import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { fetcher } from "../../shared/fetcher";

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });

  const onChangeForm: ChangeEventHandler<HTMLInputElement> = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(form.password, form.usernameOrEmail);
    fetcher("/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }).then((response) => console.log(response));
  };

  return (
    <div className="grid place-content-center h-screen">
      <form onSubmit={onSubmitForm}>
        <div className="w-60 flex-col flex gap-2 mx-auto">
          <input className="rounded-md px-2 py-1" name="usernameOrEmail" value={form.usernameOrEmail} onChange={onChangeForm} placeholder="username or email" />
          <input className="rounded-md px-2 py-1" name={"password"} value={form.password} onChange={onChangeForm} placeholder="password" type={"password"} />
          <button className="bg-purple-700 text-white rounded-lg px-4 py-2 text-lg mt-2" type={"submit"}>
            login
          </button>
        </div>
      </form>
    </div>
  );
}
