import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      visibleToasts={3}
      closeButton
      expand={false}
      gap={10}
      offset={{ top: 88, right: 20 }}
      mobileOffset={{ bottom: 76, left: 16, right: 16 }}
      className="nhl-toaster"
      icons={{
        success: <CheckCircle2 size={17} strokeWidth={2} className="toast-icon toast-icon-success" />,
        info: <Info size={17} strokeWidth={2} className="toast-icon toast-icon-info" />,
        warning: <AlertTriangle size={17} strokeWidth={2} className="toast-icon toast-icon-warning" />,
        error: <XCircle size={17} strokeWidth={2} className="toast-icon toast-icon-error" />,
      }}
      toastOptions={{
        duration: 4500,
        classNames: {
          toast: "nhl-toast",
          title: "nhl-toast-title",
          description: "nhl-toast-description",
          actionButton: "nhl-toast-action",
          cancelButton: "nhl-toast-cancel",
          closeButton: "nhl-toast-close",
          success: "nhl-toast-success",
          info: "nhl-toast-info",
          warning: "nhl-toast-warning",
          error: "nhl-toast-error",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
