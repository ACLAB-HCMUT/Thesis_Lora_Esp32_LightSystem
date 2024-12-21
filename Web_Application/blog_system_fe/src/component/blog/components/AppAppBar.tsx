import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Sitemark from "./SitemarkIcon";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import { useTranslation } from "react-i18next";
import { Avatar, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState } from "../../../redux/store";
import { logout } from "../../../redux/slice/user/signinSlice";
import "./AppAppBar.css";
const pages = ["Dashboard", "Statistical", "Profile"];
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: "8px 12px",
}));

const AppAppBar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const selectData = useSelector((state: RootState) => state.user.signin);
  const dispatch = useDispatch();
  const isSignIn = selectData.isSignedIn;
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const handleChangeLanguage = (event: SelectChangeEvent<string>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("lang", selectedLanguage);
  };
  const handleSignup = () => {
    navigate("/signin");
  };
  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
  };
  const handleSite = (data: string) => {
    if (data === "Profile") {
      navigate("/profile");
    }
    if (data === "Dashboard") {
      navigate("/dashboard");
    }
    if (data == "Statistical") {
      navigate("/statistical");
    }
  };
  const handleIcon = () => {
    navigate("/");
  };
  const handleNavigateProfile = () => {
    navigate("/profile");
  };
  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Button
              onClick={handleIcon}
              style={{ backgroundColor: "transparent" }}
            >
              <Sitemark />
            </Button>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => handleSite(page)}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {" "}
            <Select
              value={i18n.language}
              onChange={handleChangeLanguage}
              variant="outlined"
              sx={{
                mr: 2,
                color: "grey",
                borderColor: "grey",
                "& .MuiSelect-outlined": { color: "grey" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "grey" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey",
                },
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="vi">Tiếng Việt</MenuItem>
            </Select>
            <Typography
              color="textPrimary"
              style={{
                fontWeight: 600,
                textAlign: "center",
                userSelect: "none",
              }}
            >
              {selectData.fullName}
            </Typography>
            <Avatar
              className="avatar"
              src={selectData.imageURL}
              onClick={handleNavigateProfile}
            ></Avatar>
            {!isSignIn && (
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={handleSignup}
              >
                Sign up
              </Button>
            )}
            {isSignIn && (
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={handleLogout}
              >
                Log out
              </Button>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2, // Adds spacing between elements
                  padding: 2, // Optional: Adds padding around the container
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleSite(page)}>
                    {page}
                  </MenuItem>
                ))}
                <Divider sx={{ my: 3 }} />
                <MenuItem
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Select
                    value={i18n.language}
                    onChange={handleChangeLanguage}
                    variant="outlined"
                    sx={{
                      color: "black",
                      borderColor: "black",
                      "& .MuiSelect-outlined": { color: "black" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                    }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="vi">Tiếng Việt</MenuItem>
                  </Select>
                </MenuItem>
                <MenuItem>
                  <Typography
                    color="textPrimary"
                    style={{
                      fontWeight: 600,
                      textAlign: "center",
                      userSelect: "none",
                    }}
                  >
                    {selectData.fullName}
                  </Typography>
                </MenuItem>
                <MenuItem>
                  {!isSignIn && (
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={handleSignup}
                    >
                      Sign up
                    </Button>
                  )}
                  {isSignIn && (
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={handleLogout}
                    >
                      Log out
                    </Button>
                  )}
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default AppAppBar;
