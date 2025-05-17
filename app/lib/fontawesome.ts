// app/lib/fontawesome.ts
import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

// Prevent automatic CSS injection (Next.js handles this)
config.autoAddCss = false

// Solid icons (combine all at once)
import {
  faLock,
  faHouse,
  faChartPie,
  faBagShopping,
  faCartShopping,
  faCircleInfo,
  faCheckCircle,
  faTimesCircle,
  faCrown,
  faGlobe,
  faChartLine,
  faSearch
} from '@fortawesome/free-solid-svg-icons'

// Register all icons globally
library.add(
  faLock,
  faHouse,
  faChartPie,
  faBagShopping,
  faCartShopping,
  faCircleInfo,
  faCheckCircle,
  faTimesCircle,
  faCrown,
  faGlobe,
  faChartLine,
  faSearch
)