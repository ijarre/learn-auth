import { useState, ChangeEventHandler, FormEventHandler } from "react";
import { fetcher } from "../../shared/fetcher";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const onChangeForm: ChangeEventHandler<HTMLInputElement> = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    fetcher("/user/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  };

  return (
    <div className="grid place-content-center h-screen">
      <form onSubmit={onSubmitForm}>
        <h1 className="text-white text-3xl mb-2">Register</h1>
        <div className="w-60 flex-col flex gap-3 mx-auto">
          <input className="rounded-md px-2 py-1" name="username" value={form.username} onChange={onChangeForm} placeholder="username" />
          <input className="rounded-md px-2 py-1" name="email" value={form.email} type={"email"} onChange={onChangeForm} placeholder="email" />
          <input className="rounded-md px-2 py-1" name={"password"} value={form.password} onChange={onChangeForm} placeholder="password" type={"password"} />
          <button className="bg-purple-700 text-white rounded-lg px-4 py-2 text-lg mt-2" type={"submit"}>
            register
          </button>
        </div>
      </form>
    </div>
  );
}
