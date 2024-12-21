import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AppAppBar from "../blog/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ChangeEvent, useEffect, useState } from "react";
import { configAxios } from "../../config/axios";
import { toast } from "react-toastify";
import { getprofile } from "../../redux/slice/user/signinSlice";

export interface updateField {
  email: string;
  lastName: string;
  firstName: string;
  password?: string;
}
const Profile = (props: { disableCustomTheme?: boolean }) => {
  const dispatch = useDispatch();
  const data = useSelector((root: RootState) => root.user.signin);
  const token = useSelector((root: RootState) => root.user.signin.accessToken);
  // Fetch user data for update user profile if update
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await configAxios.get("auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(getprofile(response.data));
      console.log(response);
    };
    fetchUserData();
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profile, setProfile] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: "",
    image: data.imageURL,
  });

  // Handle profile change
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files && evt.target.files[0]) {
      const file = evt.target.files[0];
      setSelectedFile(file);
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Profile
  const handelSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dataUpdate: updateField = {
      email: profile.email || "",
      lastName: profile.lastName || "",
      firstName: profile.firstName || "",
    };
    if (profile.password) {
      dataUpdate.password = profile.password;
    }
    try {
      const responseProfile = await configAxios.put(
        `auth/update/${data.id}`,
        dataUpdate,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("check points");
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response_image = await configAxios.post(
          `upload/${data.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      // console.log(e)
      toast.error("Cannot save profile");
    }
  };
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: 5,
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Profile Page
            </Typography>
            <Avatar
              src={profile.image}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Button variant="contained" component="label" sx={{ mb: 3 }}>
              Upload Image
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </Button>
            <Box
              p={5}
              bgcolor="white"
              boxShadow={3}
              borderRadius={2}
              width="100%"
              maxWidth={600}
            >
              <form onSubmit={handelSaveProfile}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "1rem",
                        },
                        "& .MuiOutlinedInput-root": {
                          marginTop: "10px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "1rem",
                        },
                        "& .MuiOutlinedInput-root": {
                          marginTop: "10px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "1rem",
                        },
                        "& .MuiOutlinedInput-root": {
                          marginTop: "10px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Old Password"
                      value={"*********"}
                      variant="outlined"
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "1rem",
                        },
                        "& .MuiOutlinedInput-root": {
                          marginTop: "10px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="password"
                      type="password"
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "1rem",
                        },
                        "& .MuiOutlinedInput-root": {
                          marginTop: "10px",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  fullWidth
                >
                  Save Profile
                </Button>
              </form>
            </Box>
          </Box>
        </Container>
      </Container>
      {/* <Footer /> */}
    </AppTheme>
  );
};

export default Profile;
