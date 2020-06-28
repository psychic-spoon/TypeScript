
  interface Validatable{
    value:string|number;
    required?:boolean;
    minLength?:number;
    maxLength?:number;
    min?:number;
    max?:number;
  }

function validate(validatableInput:Validatable){
  let isValid=true;
  if(validatableInput.required){
    isValid=isValid && validatableInput.value.toString().trim().length==0;
  }
  if(validatableInput.minLength && typeof validatableInput.value==='string'){
    isValid=isValid && validatableInput.value.length>validatableInput.minLength;
  }
  if(validatableInput.maxLength && typeof validatableInput.value==='string'){
    isValid=isValid && validatableInput.value.length<validatableInput.maxLength;
  }
  if(validatableInput.max && typeof validatableInput.value==='number'){
    isValid=isValid && validatableInput.value<validatableInput.max;
  }
  if(validatableInput.min && typeof validatableInput.value==='number'){
    isValid=isValid && validatableInput.value<validatableInput.min;
  }
  return isValid;
}  
//autobind decorator
function autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// ProjectList Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
    
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  divElement: HTMLDivElement;
  formElement: HTMLFormElement;

  titleInputELement: HTMLInputElement;
  descriptionInputELement: HTMLInputElement;
  peopleInputELement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.divElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";

    this.titleInputELement = this.formElement.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputELement = this.formElement.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputELement = this.formElement.querySelector(
      "#people"
    )! as HTMLInputElement;
    this.configure();
    this.attach();
  }

  private gatherUserInput():[string,string,number]|void{
    const enteredTitle=this.titleInputELement.value;
    const enteredDescription=this.descriptionInputELement.value;
    const enteredPeople=this.peopleInputELement.value;

    const titleValidatable:Validatable={
      value:enteredTitle,
      required:true,
      minLength:5
    };
    const descValidatable:Validatable={
      value:enteredDescription,
      required:true,
      minLength:5
    };
    const peopleValidatable:Validatable={
      value:enteredPeople,
      required:true,
      min:1
    };
    if(validate(titleValidatable)&&validate(descValidatable)&&validate(peopleValidatable)){
      return [enteredTitle,enteredDescription,+enteredPeople];
    }else{
      alert('invalid Input');
      return;
    }
  }
  private clearInputs():void{
    this.titleInputELement.value='';
    this.descriptionInputELement.value='';
    this.peopleInputELement.value='';
  }


  @autobind
  private submmitHandler(event: Event) {
    event.preventDefault();
    const [title,desc,people]=this.gatherUserInput();
    this.clearInputs();
  }
  private configure() {
    this.formElement.addEventListener("submit", this.submmitHandler);
  }
  private attach() {
    this.divElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
