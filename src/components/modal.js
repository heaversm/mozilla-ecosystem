import React, { useRef, useEffect } from "react";
import MicroModal from "micromodal";

function Modal({ data }) {
  const modalRef = useRef();

  useEffect(() => {
    MicroModal.init();
  }, []);

  return (
    <div
      className="modal micromodal-slide"
      id="modal"
      aria-hidden="true"
      ref={modalRef}
    >
      <div
        className="modal__overlay flx jst-cntr"
        tabIndex="-1"
        data-micromodal-close
      >
        <div
          className="modal__container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-1-title"
        >
          <div className="flx space-between cntr modal__header">
            <h2 className="modal__title" id="modal-1-title"></h2>
            <button
              className="modal__close"
              aria-label="Close modal"
              data-micromodal-close
            ></button>
          </div>
          <div className="modal__content" id="modal-1-content">
            <img
              src="files/mozilla-fxa.svg"
              alt="Repo Visualization"
              className="modal__img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
