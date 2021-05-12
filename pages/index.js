import { useContext } from "react";
import { StateContext } from "../contexts";

export default function Home(props) {
  const { updateSuccessMessage, updateErrorMessage } = useContext(StateContext);

  return (
    <div>
      {JSON.stringify(props, null, 2)}
      <br />
      <button onClick={() => updateSuccessMessage("Exito")}>Mensaje de exito</button>
      <br />
      <button onClick={() => updateErrorMessage("Error")}>Mensaje de error</button>
    </div>
  );
}

export const getServerSideProps = async () => {
  return {
    props: {}
  };
};
