import sweetAlert from "sweetalert2";

function notify(message, type) {
  return sweetAlert.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    type: type,
    title: message,
  });
}

export default notify;
