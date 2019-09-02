import { NgModule } from "@angular/core";
import { 

    DropdownModule,
    TilesModule,
    UIShellModule

} from 'carbon-components-angular';
@NgModule({
    imports: [
        DropdownModule,
        TilesModule,
        UIShellModule
    ],
    exports: [
        DropdownModule,
        TilesModule,
        UIShellModule
    ],
})
export class CarbonModule { }