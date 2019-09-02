import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../_services';
import { DropdownList } from 'carbon-components-angular';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-deploy-template',
  templateUrl: './deploy-template.component.html',
  styleUrls: ['./deploy-template.component.sass']
})
export class DeployTemplateComponent implements OnInit {

  private templates: any[]
  templateOptions = []
  selectedTemplateName = ''
  selectedTemplateProvider = ''
  selectedTemplateDescription = ''
  selectedTemplateDetails = ''

  constructor(private templateService: TemplateService) { }

  ngOnInit() {
    this.getTemplates();

    this.templateOptions = [
      {
        "content": "Test template 1"
      },
      {
        "content": "Test template 2"
      }
    ]

  }

  getTemplates() {
    this.templateService.getTemplates()
      .subscribe(
        templates => {
          this.templates = templates
          this.templateOptions = []
          for (var i = 0; i < this.templates.length; i++) {
            this.templateOptions.push({
              "content": this.templates[i].name
            })
          }
        }
      )
  }

  templateSelected(event: EventEmitter<Object>) {
    if (event['item']) {
      this.selectedTemplateName = event['item']['content'];
    }
  }

}
