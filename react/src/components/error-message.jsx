import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
/**
 *
 * @param {string} msg
 */
export function errorMsg(msg) {
  Swal.fire({
    icon: "error",
    title: `<h1 class="text-danger text-3xl">${msg.toUpperCase()}</h1>`,
    customClass: {
      confirmButton:
        "!text-lg !border-none !bg-emerald-800 hover:!bg-emerald-500 focus:!shadow-none",
    },
  });
}
