import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import 'typeface-roboto'
import './styles/main.scss'

platformBrowserDynamic().bootstrapModule(AppModule);