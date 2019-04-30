import {Injectable} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ErrorDialogComponent } from "Components/dialogs/errordialog/errordialog.component";

@Injectable({
    providedIn: "root"
})
export class DialogService {
    constructor(private dialog: MatDialog) {
    }

    error(title: string, message: string){
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
            data: {
                title, message
            }
        })
    }
}
