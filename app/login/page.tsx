export default function LoginPage() {
  return (
    <div className="w-full max-w-2xl bg-base-100 flex flex-col p-8 rounded-2xl">
      <div className="w-full h-32 flex items-center justify-center">
        <p className="text-4xl text-base-content">Welcome to SF Social Club!</p>
      </div>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col gap-2">
          <p className="text-3xl font-semibold text-base-content">Log in</p>
          <p className="text-base text-base-content">
            Enter your email and we'll send you a login code
          </p>
        </div>
        <input
          type="email"
          placeholder="email"
          className="input input-bordered w-full"
          required={true}
        />
        <button className="btn">Continue</button>
      </div>
    </div>
  );
}
