import logo from "../../assets/logo.svg";

const Logo = ({ text }: { text?: string }) => {
  return (
    <div className="flex gap-x-3">
      <img src={logo} alt="logo" className="h-9 w-9" />
      <p className="flex flex-col -space-y-1 items-start justify-center">
        <span className="text-2xl font-extrabold text-black/80">Bascorp.</span>
        {text ? (
          <span className="text-base text-muted-foreground font-medium">
            {text}
          </span>
        ) : (
          ""
        )}
      </p>
    </div>
  );
};

export default Logo;
