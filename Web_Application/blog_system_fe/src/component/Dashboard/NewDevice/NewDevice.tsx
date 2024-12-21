import Button from "@mui/material/Button";

import { useState } from "react";
import { configAxios } from "../../../config/axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NewDevice = () => {
  const handleSubmitConfig = async () => {
    const response = await configAxios.post("device/insert");
    const content = `
def getConfig():
    return {
        'address': '${response.data.id}',
        'UART_rate': '9600',
        'parity_bit': '0',
        'air_rate': '9600',
        'package_length': '200',
        'RSSI_noise': '0',
        'power': '22',
        'channel': '1',
        'RSSI_data': '0',
        'Transmission': '1',
        'LBT': '0',
        'WOR_cycle': '500'
    }
      `;
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "config.py";
    link.click();
  };

  return (
    <div>
      <Button variant="contained" onClick={handleSubmitConfig}>
        Generate device
      </Button>
    </div>
  );
};

export default NewDevice;
