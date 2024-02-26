import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-columns',
  standalone: true,
  imports: [NgFor],
  templateUrl: './columns.component.html',
  styleUrl: './columns.component.css'
})
export class ColumnsComponent {
  columns = [
    {
      "name": "Todo",
      "tasks": [
        {
          "title": "Build UI for onboarding flow",
          "description": "",
          "status": "Todo",
          "subtasks": [
            {
              "title": "Sign up page",
              "isCompleted": true
            },
            {
              "title": "Sign in page",
              "isCompleted": false
            },
            {
              "title": "Welcome page",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "Build UI for search",
          "description": "",
          "status": "Todo",
          "subtasks": [
            {
              "title": "Search page",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "Build settings UI",
          "description": "",
          "status": "Todo",
          "subtasks": [
            {
              "title": "Account page",
              "isCompleted": false
            },
            {
              "title": "Billing page",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "QA and test all major user journeys",
          "description": "Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.",
          "status": "Todo",
          "subtasks": [
            {
              "title": "Internal testing",
              "isCompleted": false
            },
            {
              "title": "External testing",
              "isCompleted": false
            }
          ]
        }
      ]
    },
    {
      "name": "Doing",
      "tasks": [
        {
          "title": "Design settings and search pages",
          "description": "",
          "status": "Doing",
          "subtasks": [
            {
              "title": "Settings - Account page",
              "isCompleted": true
            },
            {
              "title": "Settings - Billing page",
              "isCompleted": true
            },
            {
              "title": "Search page",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "Add account management endpoints",
          "description": "",
          "status": "Doing",
          "subtasks": [
            {
              "title": "Upgrade plan",
              "isCompleted": true
            },
            {
              "title": "Cancel plan",
              "isCompleted": true
            },
            {
              "title": "Update payment method",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "Design onboarding flow",
          "description": "",
          "status": "Doing",
          "subtasks": [
            {
              "title": "Sign up page",
              "isCompleted": true
            },
            {
              "title": "Sign in page",
              "isCompleted": false
            },
            {
              "title": "Welcome page",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "Add search enpoints",
          "description": "",
          "status": "Doing",
          "subtasks": [
            {
              "title": "Add search endpoint",
              "isCompleted": true
            },
            {
              "title": "Define search filters",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "Add authentication endpoints",
          "description": "",
          "status": "Doing",
          "subtasks": [
            {
              "title": "Define user model",
              "isCompleted": true
            },
            {
              "title": "Add auth endpoints",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "Research pricing points of various competitors and trial different business models",
          "description": "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
          "status": "Doing",
          "subtasks": [
            {
              "title": "Research competitor pricing and business models",
              "isCompleted": true
            },
            {
              "title": "Outline a business model that works for our solution",
              "isCompleted": false
            },
            {
              "title": "Talk to potential customers about our proposed solution and ask for fair price expectancy",
              "isCompleted": false
            }
          ]
        }
      ]
    },
  ]
}
