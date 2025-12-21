import Button from '@mui/material/Button'



function TimeButton ({text, handleOnClick, colour}) {
    

    return (
        <div>
            <Button 
            size = "small"
            style={{
                // fontWeight: 'bold', 
                paddingRight: 7, 
                width: "90px", 
                height: "25px",
                backgroundColor:'white', 
                color: colour, 
                fontFamily: 'Handlee',
                textTransform: 'none', 
                fontSize:'18px'
            }} 
            sx={{fontWeight:900, fontSize:'16px'}}
            disableElevation
            disableFocusRipple
            disableRipple

            onClick = {handleOnClick}
            >
            {text}
            </Button> 
        </div>
    )
}

export default TimeButton;
