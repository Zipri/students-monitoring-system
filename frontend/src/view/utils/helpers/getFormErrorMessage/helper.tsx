const getFormErrorMessage = (errors: any, name: any) => {
  return errors[name] ? (
    <small className="p-error">
      <>{errors[name]?.message}</>
    </small>
  ) : (
    <small className="p-error">&nbsp;</small>
  );
};

export default getFormErrorMessage;
