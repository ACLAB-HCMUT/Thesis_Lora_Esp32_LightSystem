import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import { configAxios } from "../../config/axios";
import { toast } from "react-toastify";
const ModalActivate = (props: any) => {
  const [formData, setFormData] = useState<{
    email: string;
    activateCode: string;
  }>({
    email: "",
    activateCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleActivate = async () => {
    const response = await configAxios.post("auth/activate", formData);
    if (response) {
      toast.success(`${response.data}`);
      props.onClose();
    }
  };
  return (
    <>
      <Dialog
        open={props.isOpen}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Activate Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email address and the activation code sent to you.
          </DialogContentText>
          <Stack spacing={2} mt={2}>
            {/* Email Input */}
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
            />
            {/* Activation Code Input */}
            <TextField
              label="Activation Code"
              type="text"
              name="activateCode"
              fullWidth
              variant="outlined"
              value={formData.activateCode}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActivate}>Activate</Button>
          <Button onClick={props.onClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalActivate;
