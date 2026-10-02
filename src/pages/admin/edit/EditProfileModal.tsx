import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import SaveButton from "../../../components/SaveButton";
import ImageProcessingIndicator, {
  type ProcessingStatus,
} from "../../../components/ImageProcessingIndicator";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";
import { processImage } from "../../../lib/image";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isEmail, sanitizeText } from "../../../lib/validation";

import type { PortfolioProfile } from "../../../types/portfolio";

function loadProfileData(): PortfolioProfile {
  return loadJSON<PortfolioProfile>("visora-admin-profile", defaultProfile);
}

function EditProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { refresh } = usePortfolio();
  const [data, setData] = useState<PortfolioProfile>(loadProfileData);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [avatarStatus, setAvatarStatus] = useState<ProcessingStatus>({
    state: "idle",
  });

  const handleAvatar = async (file: File) => {
    setAvatarStatus({ state: "loading" });
    try {
      const result = await processImage(file);
      update({ avatar: result.url });
      setAvatarStatus({
        state: "done",
        originalSize: result.originalSize,
        finalSize: result.finalSize,
      });
    } catch (err) {
      setAvatarStatus({
        state: "error",
        message: (err as Error).message || "Error al procesar la imagen",
      });
    }
  };

  const update = (patch: Partial<PortfolioProfile>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    if (!isEmail(data.email)) {
      setEmailError("Ingresa un correo válido.");
      return;
    }

    saveJSON("visora-admin-profile", {
      ...data,
      location: sanitizeText(data.location).trim(),
      description: sanitizeText(data.description).trim(),
      email: data.email.trim(),
    });
    refresh();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar Perfil"
      wide
      actions={<SaveButton onClick={handleSave} />}
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Ubicación"
            value={data.location}
            onChange={(v) => update({ location: v })}
            placeholder="Ciudad, País"
          />

          <Field
            label="Email"
            type="email"
            value={data.email}
            onChange={(v) => {
              update({ email: v });
              setEmailError(undefined);
            }}
            placeholder="tu@email.com"
            required
            error={emailError}
          />

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
              Descripción
            </label>

            <textarea
              value={data.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Una breve descripción de tu trabajo"
              rows={2}
              className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Avatar (opcional)
          </label>

          <div className="flex items-center gap-4">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover ring-4 ring-neutral-100 dark:ring-[#161327]"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-xl font-light text-neutral-400 dark:bg-white/5 dark:text-[#6F6A80]">
                {(data.name || defaultProfile.name).charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]">
                Subir imagen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void handleAvatar(file);
                  }}
                />
              </label>
              <ImageProcessingIndicator status={avatarStatus} />;

              {data.avatar && (
                <button
                  type="button"
                  onClick={() => update({ avatar: undefined })}
                  className="text-xs text-neutral-400 transition-colors hover:text-red-500 dark:text-[#6F6A80] dark:hover:text-red-400"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
          El nombre, la profesión y las redes sociales se gestionan desde{" "}
          <strong>Configuración</strong>.
        </p>
      </div>
    </Modal>
  );
}

export default EditProfileModal;
