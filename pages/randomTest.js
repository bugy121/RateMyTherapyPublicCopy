import { Box } from '@chakra-ui/react'
export default function randomTest() {
    return (
        <div>
            <Box h='50px'></Box>
            <input type='currency'/>
            <input type="number" step="0.01" pattern="[0-9]+(\.[0-9]{0,2})?" title="Please enter a valid monetary value" required />
            <input type="number" step="0.01" pattern="[0-9]+(\.[0-9]{0,2})?" title="Please enter a valid monetary value" required />
        </div>
    )
}