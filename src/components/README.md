# Components Directory Structure

This directory contains all reusable UI components organized by feature and functionality. The structure follows Next.js best practices for component organization and maintainability.

## Directory Structure

```
components/
├── activity/           # Activity-related components
├── auth/              # Authentication components
├── board/             # Board management components
│   ├── card/          # Card-specific components
│   └── list/          # List-specific components
├── forms/             # Form components
├── layout/            # Layout wrapper components
├── modals/            # Modal dialog components
├── navigation/        # Navigation-related components
├── organization/      # Organization management components
├── ui/               # Base UI components (shadcn/ui)
├── index.ts          # Main exports file
└── README.md         # This file
```

## Organization Principles

### 1. Feature-Based Organization
Components are grouped by their primary feature or domain:
- `board/` - All board-related functionality
- `organization/` - Organization management
- `activity/` - Activity tracking and display
- `forms/` - Reusable form components

### 2. Hierarchical Structure
Complex features have sub-directories:
- `board/card/` - Card-specific components
- `board/list/` - List-specific components
- `modals/card-modal/` - Card modal components

### 3. Consistent Exports
Each directory includes an `index.ts` file that:
- Re-exports all components from that directory
- Provides a clean import interface
- Maintains backward compatibility

## Component Categories

### UI Components (`ui/`)
Base components from shadcn/ui and custom utility components:
- Button, Input, Dialog, Card, etc.
- Theme providers and toggles
- Loading states and skeletons

### Layout Components (`layout/`)
Page-level layout components:
- `ClerkLayout` - Authentication layout wrapper

### Navigation Components (`navigation/`)
Navigation-related components:
- `Navbar` - Main application navbar
- `LandingNavbar` - Landing page navigation
- `NavbarItems` - Navigation item components

### Board Components (`board/`)
Kanban board functionality:
- `BoardNavbar` - Board-specific navigation
- `BoardOptions` - Board settings and actions
- `ListContainer` - Drag-and-drop list container
- `card/CardItem` - Individual card components
- `list/ListItem` - List components

### Form Components (`forms/`)
Reusable form components:
- `CardForm` - Create/edit card forms
- `ListForm` - Create/edit list forms
- `CreateBoardDialog` - Board creation modal

### Modal Components (`modals/`)
Dialog and modal components:
- `card-modal/` - Complete card modal with actions, description, activity

### Organization Components (`organization/`)
Organization management:
- `BoardsClient` - Organization board grid
- `OrgControl` - Organization switching logic
- `OrganizationProfile` - Organization settings

### Activity Components (`activity/`)
Activity tracking and display:
- `ActivityItem` - Individual activity entries
- `ActivityList` - Activity feed with loading states

### Auth Components (`auth/`)
Authentication-related components:
- `SignOutButton` - User sign out functionality

## Usage Examples

### Importing Components

```typescript
// Import from main index
import { BoardNavbar, ListContainer } from '~/components/board';
import { CardModal } from '~/components/modals';

// Import from specific directories
import { CreateBoardDialog } from '~/components/forms';
import { ActivityList } from '~/components/activity';
```

### Component Organization Guidelines

1. **Single Responsibility**: Each component has a clear, single purpose
2. **Reusability**: Components are designed to be reusable across features
3. **Type Safety**: All components use TypeScript with proper type definitions
4. **Accessibility**: Components follow WCAG guidelines and include ARIA attributes
5. **Performance**: Components are optimized for performance with proper memoization

## File Naming Conventions

- **Components**: PascalCase (e.g., `BoardNavbar.tsx`)
- **Files**: kebab-case for non-component files (e.g., `index.ts`)
- **Directories**: kebab-case (e.g., `card-modal/`)

## Import Path Standards

All components should be imported using the `~/components` alias:

```typescript
// ✅ Correct
import { BoardNavbar } from '~/components/board';
import { Button } from '~/components/ui/button';

// ❌ Avoid
import BoardNavbar from '../../../components/board/board-navbar';
```

## Adding New Components

When adding new components:

1. Place in the appropriate feature directory
2. Create TypeScript interfaces for all props
3. Add to the directory's `index.ts` export file
4. Include JSDoc comments for complex components
5. Add accessibility attributes where needed
6. Follow the existing patterns for error handling and loading states

## Migration Notes

This structure represents a migration from the previous app-directory co-located components to a centralized component system. The benefits include:

- Better code reusability
- Cleaner import statements
- Easier testing and maintenance
- Consistent component organization
- Better IDE support and autocomplete

## Dependencies

Components rely on:
- React 18+ with hooks
- Next.js 14+ (App Router)
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for base components
- Lucide React for icons
- Various utility libraries (clsx, etc.)