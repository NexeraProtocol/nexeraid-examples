import React, { useEffect, useState } from "react";
import { type ICenterModal } from "@/features/Modals/Hooks/useGlobalModals";

import { Icon } from "@nexeraprotocol/react-components";

export const CenterModal = ({
  isOpen,
  overlay = true,
  children,
  style = "default",
  bg = "default",
  onClose,
}: ICenterModal) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setIsOpenModal(isOpen);
  }, [isOpen]);

  const modalStyle = style === "default" ? "rounded-0" : "rounded-2xl";
  const modalBg = bg === "default" ? "!bg-white" : "!bg-bg-muted";
  const clasName = `${modalStyle} ${modalBg}`;

  return (
    <>
      {isOpenModal && (
        <div className="fixed z-50">
          {overlay && (
            <div className="fixed inset-0 bg-[#0000]/75" aria-hidden="true" />
          )}
          <div className="fixed inset-0 m-[16px] flex items-center justify-center">
            <div
              className={`relative flex min-h-[200px] w-full max-w-[480px] flex-col items-center justify-center gap-4 p-5 ${clasName}`}
            >
              <Icon
                icon="exit"
                className="absolute right-4 top-4 cursor-pointer"
                onClick={onClose}
              />
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
