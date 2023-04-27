import React, { useState } from "react";
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
  Link
} from "@mui/material";
import {
  Select,
  MenuItem
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

const App = () => {

  const { t } = useTranslation();
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const goToDashboard = () => navigate("/dashboard");
  const handleChange = (e) => {
    setLanguage(language => e.target.value);
    i18n.changeLanguage(e.target.value)
  }

  return (
    <div style={{
      display: "flex",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{ position: 'fixed', top: 0, right: 0, marginRight: '100px', marginTop: '20px' }}>
        <Select
          value={language}
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value={'en'}>English</MenuItem>
          <MenuItem value={'ms'}>Malay</MenuItem>
          <MenuItem value={'zh'}>Chinese</MenuItem>
        </Select>
      </div>
      <div>
        <Card
          sx={{
            minWidth: "50vh",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", gap: "2px", alignSelf: "self-start" }}>
              <div
                style={{
                  background: "rgba(255, 70, 30, 1)",
                  padding: "8px 16px",
                  fontFamily: "Source Sans Pro",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                HOUSE
              </div>
              <div
                style={{
                  background: "rgba(255, 200, 48, 1)",
                  padding: "8px 16px",
                  fontFamily: "Source Sans Pro",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                TALK
              </div>
            </div>
            <Typography
              sx={{
                fontFamily: "Source Sans Pro",
                fontSize: 24,
                fontWeight: "bold",
                color: "rgba(34, 34, 34, 1)",
              }}
            >
              {t('login_title')}
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              variant="outlined"
              placeholder="yourname@example.com"
            />
            <Button
              sx={{
                width: "100%",
                borderRadius: "32px",
                backgroundColor: "rgba(61, 186, 177, 1)",
                "&:hover": { backgroundColor: "rgba(61, 186, 177, 1)" },
              }}
              variant="contained"
              disableFocusRipple
              onClick={goToDashboard}
            >
              {t('login_btn')}
            </Button>
            <Link
              href="#"
              sx={{
                alignSelf: "center",
                color: "rgba(34, 34, 34, 1)",
                textDecorationColor: "rgba(34, 34, 34, 1)",
              }}
              onClick={goToDashboard}
            >
              {t('annoymous')}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
