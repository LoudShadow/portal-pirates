import { Palette, PaletteColor } from "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Palette {
        additional: {
            brand6: string;
            brand7: string;
            brand8: string;
            brand9: string;
        }
    }
    interface PaletteOptions {
        additional: {
            brand6: string;
            brand7: string;
            brand8: string;
            brand9: string;
        }
    }
}