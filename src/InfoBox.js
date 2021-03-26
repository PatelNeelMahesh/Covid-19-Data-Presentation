import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'

function InfoBox({ title, cases, total }) {
    return (
        <Card className="infoBox">
            <CardContent>
                {/*Title*/}
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>

                {/*Number of cases*/}
                <h2 className="infoBox_cases">{cases}</h2>

                {/*Total*/}
                <Typography className="infoBox_total" color="textSecondary">
                    {total} Total
                </Typography>

            </CardContent> 
        </Card>
    )
}

export default InfoBox
