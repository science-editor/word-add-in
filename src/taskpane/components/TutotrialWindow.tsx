import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";

function TutorialWindow({ showTutorial, closeTutorialWindow, apiKey, handleApiKeyChange }) {
    const endocURL = "https://endoc.ethz.ch/";
    const zoteroURL = "https://www.zotero.org/";

    return (
        <Dialog
            open={Boolean(showTutorial)}
            onClose={() => closeTutorialWindow(null)}
            fullWidth
            maxWidth="md"
            scroll="body"
        >
            <DialogActions>
                <IconButton
                    aria-label="Close tutorial"
                    size="medium"
                    sx={{ width: 32, height: 32, borderRadius: "50%" }}
                    onClick={() => closeTutorialWindow(null)}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </DialogActions>

            <DialogTitle sx={{ fontWeight: "bold" }}>
                Set Up your Word Add-in
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="h6" gutterBottom>
                    Get your API Key
                </Typography>
                <List sx={{ mb: 3 }}>
                    <ListItem disableGutters>
                        <ListItemText
                            primary={
                                <>
                                    1. Create a free{" "}
                                    <Link
                                        href={endocURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        Endoc
                                    </Link>{" "}
                                    account or log in to your existing one.
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemText
                            primary="2. Go to Account Settings, and generate a new API Key or use an existing one."
                        />
                    </ListItem>
                    <div style={{display: "flex", marginBottom: "20px"}}>
                        <img
                            src="/assets/tutorial_account_settings.png"
                            alt="Account Settings"
                            height={200}
                            style={{
                                marginRight: '40px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                borderRadius: '4px',
                            }}
                        />
                        <img
                            src="/assets/tutorial_api_key.png"
                            alt="Get Api Key"
                            height={200}
                            style={{
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <ListItem
                        disableGutters
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            py: 1,
                        }}
                    >
                        <ListItemText
                            primary="3. Save your Key:"
                            sx={{ flex: '0 0 auto' }}
                        />
                        <TextField
                            value={apiKey}
                            onChange={handleApiKeyChange}
                            placeholder="Enter your Endoc API key…"
                            variant="outlined"
                            size="small"
                            sx={{
                                ml: 1,
                                flex: '0 0 auto',
                                width: 300,
                            }}
                        />

                    </ListItem>
                </List>

                <hr className="divider" />

                <Typography variant="h6" gutterBottom>
                    Connect to Zotero
                </Typography>
                <List>
                    <ListItem disableGutters>
                        <ListItemText
                            primary={
                                <>
                                    1. Go to{" "}
                                    <Link
                                        href={endocURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        Endoc
                                    </Link>{" "}
                                    and navigate to your Account Settings.
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemText
                            primary="Connect your Zotero Account to Endoc."
                        />
                    </ListItem>
                    <img
                        src="/assets/tutorial_zotero.png"
                        alt="Connect to Zotero"
                        height={160}
                        style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '4px',
                        }}
                    />
                    <ListItem disableGutters>
                        <ListItemText
                            primary="3. You will now be able to add papers to your Zotero Collection directly through the Word-add-in."
                        />
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default TutorialWindow;
