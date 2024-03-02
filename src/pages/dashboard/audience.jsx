import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export function Audience() {

    return (
        <div className="mt-12">
            <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Card className="overflow-hidden xl:col-span-3 border border-blue-gray-100 shadow-sm">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="m-0 flex items-center justify-between p-6"
                    >
                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-1">
                                Audience Selection
                            </Typography>
                            <Typography
                                variant="small"
                                className="flex items-center gap-1 font-normal text-blue-gray-600"
                            >
                            </Typography>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 flex items-center">
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default Audience;