import { useState, Dispatch, SetStateAction } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { CurrentWeather } from "../../Interfaces/Interface";
import { fetchCurrentData, fetchOneCallData } from "../../Api";
import Notification from "../Notification/Notification";
import "./UserForm.css";

interface Props {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  setCurrentWeather: Dispatch<SetStateAction<CurrentWeather | null>>;
}

const UserForm: React.FC<Props> = ({ name, setName, setCurrentWeather }) => {
  const [userInput, setUserInput] = useState<string>("");
  const [nameExist, SetNameExists] = useState<boolean>(name ? true : false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const handleSubmitClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const currentWeatherData = await fetchCurrentData(userInput);
      const oneCallData = await fetchOneCallData(
        currentWeatherData.lat,
        currentWeatherData.lon,
        currentWeatherData.city,
        currentWeatherData.country
      );
      setCurrentWeather(oneCallData.dailyData[0]);
    } catch (error: any) {
      if (error.response.status === 404) {
        DisplayError(
          `Error 404: City/Zip Code "${userInput}" does not exist. Ensure that it is typed correctly and try again.`
        );
      } else if (error.response.status === 400) {
        DisplayError("Error 400: Bad Request. Unable to fetch from the API.");
      } else if (error.response.status === 500) {
        DisplayError("Error 500: Internal Server Error.");
      }
      console.log(error);
    }
  };

  const DisplayError = (errorMsg: string) => {
    setNotificationMessage(errorMsg);
    setOpenNotification(true);
  };

  const handleEditClick = () => {
    SetNameExists(false);
  };

  return (
    <div>
      <Notification
        message={notificationMessage}
        open={openNotification}
        setOpen={setOpenNotification}
        type="error"
      />
      <form onSubmit={handleSubmitClick} className="start-card">
        <Typography sx={{ fontWeight: "bold" }} color="aliceblue" variant="h5">
          Welcome to
          <span className="text-color"> Moves Weather App</span>
        </Typography>
        <Typography color="aliceblue">
          Please enter your <b>name</b> and <b>location</b>
        </Typography>
        {nameExist ? (
          <div className="display-name">
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginRight: 2 }}
            >
              {name}
            </Typography>
            <IconButton color="inherit" size="small" onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          </div>
        ) : (
          <TextField
            onChange={(e) => setName(e.target.value)}
            sx={{ m: 1, width: "20ch" }}
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ className: "text-label" }}
            label="Name"
            variant="filled"
            size="small"
            color="primary"
            required
          />
        )}
        <TextField
          onChange={(e) => setUserInput(e.target.value)}
          sx={{ m: 1, width: "20ch" }}
          inputProps={{ style: { color: "white" } }}
          InputLabelProps={{ className: "text-label" }}
          label="City or Zip Code"
          variant="filled"
          size="small"
          required
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<SearchIcon />}
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default UserForm;
