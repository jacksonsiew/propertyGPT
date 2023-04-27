import React, { useState } from "react";
import { useWhisper } from "@chengsokdara/use-whisper";
import "./styles/font.css";
import swal from "sweetalert";
import "react-chat-elements/dist/main.css";
import {
    Dialog,
    DialogContent,
    Button,
    makeStyles,
    Paper,
    Select,
    MenuItem
} from "@material-ui/core";
import Snackbar from "@mui/material/Snackbar";
import {
    Send,
    Mic,
    MicNone,
    VolumeUp,
    VolumeOff,
    Room,
} from "@material-ui/icons";
import { MessageList } from "react-chat-elements";
import { ThreeDots } from "react-loader-spinner";
import GoogleMapReact from "google-map-react";
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const devMode = true;

function Dashboard() {
    const { t } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const handleChange = (e) => {
        setLanguage(language => e.target.value);
        i18n.changeLanguage(e.target.value)
    }

    const classes = useStyles();
    const [messages, setMessages] = useState([
        {
            position: "left",
            type: "text",
            text: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "Source Sans Pro",
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#222222",
                        }}
                    >
                        {t('which_interested')}
                    </div>
                    <div
                        style={{
                            fontFamily: "Source Sans Pro",
                            fontSize: "12px",
                            color: "#222222",
                        }}
                    >
                        {t('top_sales')}
                    </div>
                    <Button
                        variant="outlined"
                        className={classes.button}
                        onClick={(e) => handleSendMessage("Puchong Utama", e)}
                    >
                        Puchong Utama
                    </Button>
                    <div
                        style={{
                            fontFamily: "Source Sans Pro",
                            fontSize: "12px",
                            color: "#222222",
                        }}
                    >
                        Limited units available <span style={{ color: 'red' }}>(sold out)</span>
                    </div>
                    <Button
                        variant="outlined"
                        className={classes.button}
                        onClick={(e) => handleSendMessage("Puchong Wawasan", e)}
                        disabled={true}
                    >
                        Puchong Wawasan
                    </Button>
                    <Button
                        variant="outlined"
                        className={classes.button}
                        onClick={(e) => handleSendMessage("Puchong Prima", e)}
                        disabled={true}
                    >
                        Puchong Prima
                    </Button>
                </div>
            ),
            date: new Date(),
        },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [recording, setRecording] = useState(false);
    const [selectOption, setSelectOption] = useState("");
    const [bSelectOption, setBSelectOption] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [volumeEnabled, setVolumeEnabled] = useState(false);
    const [showSnapbar, setShowSnapbar] = useState(false);

    const msg = new SpeechSynthesisUtterance();

    const {
        transcript,
        startRecording,
        stopRecording
    } = useWhisper({
        apiKey: '<openai_api_key>',
        streaming: true,
        timeSlice: 1_000, // 1 second
        whisperConfig: {
            language: 'en',
        }
    })

    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = async (selection, e) => {
        if (selection) {
            setBSelectOption(selection);
            setMessages((messages) => [
                {
                    position: "left",
                    type: "text",
                    text: (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "Source Sans Pro",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    color: "#222222",
                                }}
                            >
                                {t('which_interested')}
                            </div>
                            <div
                                style={{
                                    fontFamily: "Source Sans Pro",
                                    fontSize: "12px",
                                    color: "#222222",
                                }}
                            >
                                {t('top_sales')}
                            </div>
                            <Button
                                variant="outlined"
                                className={classes.selectedButton}
                            >
                                Puchong Utama
                            </Button>
                            <div
                                style={{
                                    fontFamily: "Source Sans Pro",
                                    fontSize: "12px",
                                    color: "#222222",
                                }}
                            >
                                {t('limited_unit')} <span style={{ color: 'red' }}>{t('sold_out')}</span>
                            </div>
                            <Button
                                variant="outlined"
                                className={classes.button}
                                onClick={(e) => handleSendMessage("Puchong Wawasan", e)}
                                disabled={true}
                            >
                                Puchong Wawasan
                            </Button>
                            <Button
                                variant="outlined"
                                className={classes.button}
                                onClick={(e) => handleSendMessage("Puchong Prima", e)}
                                disabled={true}
                            >
                                Puchong Prima
                            </Button>
                        </div>
                    ),
                    date: new Date(),
                },
                {
                    position: "right",
                    type: "text",
                    text: t('interested_in', { selection }),
                    date: new Date(),
                },
            ]);
        } else {
            setMessages((messages) => [...messages,
            {
                position: "right",
                type: "text",
                text: newMessage,
                date: new Date(),
            },
            ]);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setMessages((messages) => [
            ...messages,
            {
                position: "left",
                type: "text",
                text: (
                    <ThreeDots
                        wrapperStyle={{ paddingTop: "15px" }}
                        visible={true}
                        color="#0099ff"
                        height={10}
                        width={100}
                        radius={20}
                    />
                ),
                date: new Date(),
            },
        ]);

        const sendMsg = newMessage;
        setNewMessage('');

        fetch(
            devMode
                ? "http://localhost:3000/api/chat"
                : "http://192.168.100.94:8080/api/chat",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: selection ? t('interested_in', { selection }) : sendMsg,
                }),
            }
        )
            .then((response) => {
                if (!response.ok) {
                    this.setState({ searchLoading: false });
                    alert("Error", response.status.toString());
                    throw Error("Error " + response.status);
                }
                return response.json();
            })
            .then((response) => {
                if (selection) {
                    setSelectOption(selection);
                }
                const textArray = response.content.split(" ");
                let currentWord = 0;
                let prevWords = [];
                const intervalId = setInterval(() => {
                    prevWords = [...prevWords, textArray[currentWord] + " "];
                    setMessages((messages) => [
                        ...messages.slice(0, -1),
                        {
                            position: "left",
                            type: "text",
                            text: prevWords,
                            date: new Date(),
                        },
                    ]);
                    currentWord++;
                    if (currentWord === textArray.length) clearInterval(intervalId);
                }, 100);
                if (volumeEnabled) {
                    msg.text = response.content;
                    window.speechSynthesis.speak(msg);
                }
            });
    };

    const handleStartRecording = () => {
        startRecording();
        setRecording(true);
    };

    const handleStopRecording = async () => {
        stopRecording();
        setNewMessage(transcript.text);
        setRecording(false);
    };

    const volumeToggle = () => {
        setVolumeEnabled(!volumeEnabled);
        setShowSnapbar(true);
    };

    const AnyReactComponent = ({ text }) => (
        <Room fontSize="small" style={{ color: "red" }} />
    );

    const defaultProps = {
        center: {
            lat: 2.9982416,
            lng: 101.5828621,
        },
        zoom: 11,
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const closeSnapBar = () => {
        setShowSnapbar(false);
    };

    return (
        <Dialog open={true} fullScreen={true}>
            <Snackbar
                open={showSnapbar}
                autoHideDuration={3000}
                onClose={closeSnapBar}
                message={volumeEnabled ? "Sound is turned On" : "Sound is turned Off"}
            />
            <div
                style={{
                    margin: "10px",
                    display: "flex",
                    justifyContent: "space-between",
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
                <div style={{ marginTop: "10px", marginRight: "10px" }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={language}
                        onChange={(e) => handleChange(e)}
                    >
                        <MenuItem value={'en'}>English</MenuItem>
                        <MenuItem value={'ms'}>Malay</MenuItem>
                        <MenuItem value={'zh'}>Chinese</MenuItem>
                    </Select>
                    {volumeEnabled ? (
                        <VolumeOff
                            fontSize="small"
                            className={classes.rightIcon}
                            style={{
                                marginLeft: "12px",
                                alignSelf: "center",
                                color: "2A42FF",
                            }}
                            onClick={volumeToggle}
                        />
                    ) : (
                        <VolumeUp
                            fontSize="small"
                            className={classes.rightIcon}
                            style={{
                                marginLeft: "12px",
                                alignSelf: "center",
                                color: "2A42FF",
                            }}
                            onClick={volumeToggle}
                        />
                    )}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                    overflow: "hidden",
                }}
            >
                {selectOption ? (
                    <DialogContent
                        style={{
                            marginTop: "15px",
                            marginBottom: "15px",
                            width: "20%",
                            background: "#FFFFFF",
                            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                            borderRadius: "8px",
                            maxHeight: "100%",
                        }}
                    >
                        <div style={{ fontSize: "24px", color: "#222222" }}>
                            {t('dashboard_title')}
                        </div>
                        <br />
                        <Button variant="outlined" className={classes.selectedButton2}>
                            Puchong Utama
                        </Button>
                        <br />
                        <br />
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "nowrap",
                                color: "#222222",
                                fontSize: "14px",
                                lineHeight: "16px",
                                fontFamily: "Source Sans Pro",
                                fontWeight: "lighter",
                            }}
                        >
                            {t('type_a')} <br />
                            {t('type_b')} <br />
                            {t('type_a1')} <br />
                            <br />
                            {t('tower_a')}
                            <br />
                            {t('tower_a')}
                        </div>
                        <br />
                        <div
                            style={{
                                fontSize: "14px",
                                color: "#222222",
                                fontWeight: "bold",
                                marginBottom: "5px",
                            }}
                        >
                            {t('advantages')}
                        </div>
                        <div style={{ fontSize: "13px", color: "#222222" }}>
                            {t('adv_1')}
                            <br />
                            {t('adv_2')}
                            <br />
                            {t('adv_3')}
                            <br />
                            {t('adv_4')}
                            <br />
                            {t('adv_5')}
                            <br />
                        </div>
                        <br />
                        <div
                            style={{
                                fontSize: "14px",
                                color: "#222222",
                                fontWeight: "bold",
                                marginBottom: "5px",
                            }}
                        >
                            {t('disadvantages')}
                        </div>
                        <div style={{ fontSize: "13px", color: "#222222" }}>
                            {t('dadv_1')}
                            <br />
                            {t('dadv_2')}
                            <br />
                            {t('dadv_3')}
                            <br />
                        </div>
                        <br />
                        <button onClick={toggleCollapse}>
                            {isCollapsed ? t('more_detail') : t('collapse')}
                        </button>
                        <br />
                        <br />
                        {!isCollapsed && (
                            <div>
                                <div style={{ height: "250px", width: "270px" }}>
                                    <GoogleMapReact
                                        bootstrapURLKeys={{
                                            key: "<google_api_key>",
                                        }}
                                        defaultCenter={defaultProps.center}
                                        defaultZoom={defaultProps.zoom}
                                    >
                                        <AnyReactComponent
                                            lat={2.9982416}
                                            lng={101.5828621}
                                            text="My Marker"
                                        />
                                    </GoogleMapReact>
                                </div>
                                <br />
                                <br />
                                <iframe
                                    title="4d"
                                    src="https://my.matterport.com/show/?m=D5LcnDgfQmJ"
                                    width="270"
                                    height="250"
                                    frameborder="0"
                                    allowfullscreen
                                    allow="xr-spatial-tracking"
                                ></iframe>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Button
                                        style={{ fontSize: "12px" }}
                                        onClick={() => {
                                            window.open(
                                                "https://my.matterport.com/show/?m=D5LcnDgfQmJ",
                                                "_blank"
                                            );
                                        }}
                                    >
                                        {t('full_screen')}
                                    </Button>
                                </div>
                                <br />
                                <br />
                                <iframe
                                    title="youtube"
                                    src="https://www.youtube.com/embed/q6X9BTnR7lA"
                                    width="270"
                                    height="250"
                                    frameborder="0"
                                    allow="autoplay; encrypted-media"
                                    allowfullscreen
                                ></iframe>
                                <br />
                                <br />
                            </div>
                        )}
                    </DialogContent>
                ) : (
                    <DialogContent
                        style={{
                            marginTop: "15px",
                            marginBottom: "15px",
                            width: "20%",
                            background: "#FFFFFF",
                            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                            borderRadius: "8px",
                        }}
                    >
                        <div style={{ fontSize: "24px", color: "#222222" }}>
                            {t('dashboard_title')}
                        </div>
                        <div style={{ fontSize: "12px", color: "#7F8C98" }}>
                            {t('not_yet')}
                        </div>
                        <br />
                        <br />
                        <div style={{ fontSize: "14px", color: "#222222" }}>
                            {t('selection_project')}
                        </div>
                        <br />
                        <div
                            style={{
                                fontSize: "12px",
                                color: "#222222",
                                marginBottom: "10px",
                            }}
                        >
                            {t('top_sales')}
                        </div>
                        {bSelectOption ?
                            <Button
                                variant="outlined"
                                className={classes.selectedButton}
                                onClick={(e) => handleSendMessage("Puchong Utama", e)}
                            >
                                Puchong Utama
                            </Button>
                            :
                            <Button
                                variant="outlined"
                                className={classes.button}
                                onClick={(e) => handleSendMessage("Puchong Utama", e)}
                            >
                                Puchong Utama
                            </Button>
                        }
                        <br />
                        <br />
                        <div
                            style={{
                                fontSize: "12px",
                                color: "#222222",
                                marginBottom: "10px",
                            }}
                        >
                            {t('limited_unit')} <span style={{ color: 'red' }}>{t('sold_out')}</span>
                        </div>
                        <Button
                            variant="outlined"
                            className={classes.button}
                            style={{ marginBottom: "10px" }}
                            onClick={(e) => handleSendMessage("Puchong Wawasan", e)}
                            disabled={true}
                        >
                            Puchong Wawasan
                        </Button>
                        <Button
                            variant="outlined"
                            className={classes.button}
                            onClick={(e) => handleSendMessage("Puchong Prima", e)}
                            disabled={true}
                        >
                            Puchong Prima
                        </Button>
                    </DialogContent>
                )}
                <DialogContent
                    className={classes.dialogContent}
                    style={{ width: "80%", borderRadius: "8px" }}
                >
                    <React.Fragment>
                        <div
                            style={{
                                maxHeight: "100%",
                                display: "flex",
                                flexDirection: "column-reverse",
                                overflowY: "auto",
                                backgroundColor: "#FFF5F2",
                            }}
                        >
                            <MessageList
                                className="message-list"
                                // lockable={true}
                                toBottomHeight={"100%"}
                                dataSource={messages.map((message) => ({
                                    position: message.position,
                                    type: "text",
                                    text: message.text,
                                    date: message.createdAt,
                                }))}
                                messageBoxStyles={{
                                    marginBottom: "20px",
                                }}
                            />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
                            <Paper className={classes.inputBox}>
                                <input
                                    style={{
                                        border: "0px",
                                        outline: "none",
                                        paddingTop: "5px",
                                        paddingBottom: "5px",
                                        width: "100%",
                                    }}
                                    type="text"
                                    placeholder={t('input_type_your_msg')}
                                    value={recording ? transcript.text : newMessage}
                                    onChange={(e) => handleNewMessageChange(e)}
                                />
                            </Paper>
                            <div style={{ display: "flex" }}>
                                {recording ? (
                                    <Mic
                                        fontSize="small"
                                        className={classes.rightIcon}
                                        style={{
                                            marginLeft: "12px",
                                            alignSelf: "center",
                                            color: "2A42FF",
                                        }}
                                        onClick={handleStopRecording}
                                    />
                                ) : (
                                    <MicNone
                                        fontSize="small"
                                        className={classes.rightIcon}
                                        style={{
                                            marginLeft: "12px",
                                            alignSelf: "center",
                                            color: "2A42FF",
                                        }}
                                        onClick={handleStartRecording}
                                    />
                                )}
                                <Send
                                    fontSize="small"
                                    className={classes.rightIcon}
                                    style={{
                                        marginLeft: "12px",
                                        alignSelf: "center",
                                        color: "2A42FF",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        if (newMessage !== "") {
                                            handleSendMessage();
                                        } else {
                                            swal("Please enter message.", {
                                                icon: "info",
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                </DialogContent>
            </div>
        </Dialog>
    );
}

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        padding: "18px",
        display: "grid",
        gridAutoRows: "1fr auto",
        gridGap: "24px",
    },
    inputBox: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    button: {
        borderRadius: "30px",
        borderColor: "#FF461E",
        color: "#FF461E",
        fontWeight: "lighter",
        fontSize: "14px",
        "&:hover": {
            background: "#FF461E",
            color: "#FFFFFF",
        },
    },
    selectedButton: {
        borderRadius: "30px",
        borderColor: "#FF461E",
        color: "#FFFFFF",
        fontWeight: "lighter",
        fontSize: "14px",
        background: "#FF461E",
        "&:hover": {
            background: "#FF461E",
            color: "#FFFFFF",
        },
    },
    selectedButton2: {
        borderRadius: "5px",
        borderColor: "#FF461E",
        color: "#FFFFFF",
        fontWeight: "lighter",
        fontSize: "14px",
        background: "#FF461E",
        "&:hover": {
            background: "#FF461E",
            color: "#FFFFFF",
        },
    },
}));

export default Dashboard;
