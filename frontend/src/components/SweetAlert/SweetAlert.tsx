import Swal from 'sweetalert2';
import './sweetalert-theme.css';

const defaultStyles = {
  customClass: {
    title: 'ant-swal-title',
    popup: 'ant-swal-popup',
    confirmButton: 'ant-swal-confirm',
    cancelButton: 'ant-swal-cancel',
  },
  buttonsStyling: false, // desabilita os estilos padrão do SweetAlert2
};

export const SweetAlert = {
  success: (title: string, text?: string) =>
    Swal.fire({
      icon: 'success',
      title,
      html: text,
      confirmButtonText: 'OK',
      ...defaultStyles,
    }),

  error: (title: string, text?: string) =>
    Swal.fire({
      icon: 'error',
      title,
      html: text || 'Algo deu errado.',
      confirmButtonText: 'OK',
      ...defaultStyles,
    }),

  confirm: async (title: string, text: string) =>
    Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      ...defaultStyles,
    }),

  loading: (title = 'Carregando...') =>
    Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      ...defaultStyles,
    }),

  warning: (title: string, text?: string) =>
    Swal.fire({
      icon: 'warning',
      title,
      html: text || 'Atenção!',
      confirmButtonText: 'OK',
      ...defaultStyles,
    }),

  close: () => Swal.close(),
};
