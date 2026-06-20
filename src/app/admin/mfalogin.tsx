import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { UseMutationResult } from "@tanstack/react-query";
import { Models } from "appwrite";

interface MFALoginProps {
  isMfaRequired: boolean;
  mfaChallengeId: string;
  totpCode: string;
  setTotpCode: React.Dispatch<React.SetStateAction<string>>;
  verifyMfaLoginMutation: UseMutationResult<Models.User<Models.Preferences>, Error, { challengeId: string; code: string }, unknown>;
  loginMutation: UseMutationResult<Models.User<Models.Preferences>, unknown, void, unknown>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  rememberMe: boolean;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MFALogin = ({
  isMfaRequired,
  mfaChallengeId,
  totpCode,
  setTotpCode,
  verifyMfaLoginMutation,
  loginMutation,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
}: MFALoginProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h2 className="text-3xl font-black tracking-tight mb-6 text-center text-on-surface uppercase">
          {isMfaRequired ? "Verificación" : "Iniciar Sesión"}
        </h2>

        {isMfaRequired ? (
          <form className="space-y-4">
            <p className="text-sm text-center text-on-surface-variant mb-4">
              Ingresa el código de 6 dígitos de tu aplicación de autenticación.
            </p>
            <input
              type="text"
              placeholder="000000"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              maxLength={6}
              className="w-full p-3 text-center text-2xl tracking-widest border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={() =>
                verifyMfaLoginMutation.mutate({
                  challengeId: mfaChallengeId,
                  code: totpCode,
                })
              }
              disabled={totpCode.length < 6 || verifyMfaLoginMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyMfaLoginMutation.isPending
                ? "Verificando..."
                : "Verificar Código"}
            </button>
          </form>
        ) : (
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none flex items-center justify-center"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            <div className="flex items-center space-x-2 px-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary transition-all cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-on-surface-variant font-medium cursor-pointer select-none"
              >
                Recordar mis datos
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                if (rememberMe) {
                  localStorage.setItem(
                    "adminCreds",
                    JSON.stringify({
                      savedEmail: email,
                      savedPassword: password,
                    }),
                  );
                } else {
                  localStorage.removeItem("adminCreds");
                }
                loginMutation.mutate();
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              {loginMutation.isPending ? "Iniciando..." : "Iniciar Sesion"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
