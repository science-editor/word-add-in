import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";

const GoogleScholarChip = ({ paper }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (paper.title) {
            setShow(true);
        }
    }, []);

    const openInNewTab = () => {
        window.open(
            `https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=${paper.title}`,
            "_blank",
            "noreferrer"
        );
    };

    return show ? (
        <Chip
            icon={<LaunchOutlinedIcon />}
            label="Google Scholar Search"
            variant="outlined"
            size="small"
            onClick={openInNewTab}
            sx={{
                fontSize: "10px",
                padding: "10px",
            }}
        />
    ) : null;
};

export default GoogleScholarChip;