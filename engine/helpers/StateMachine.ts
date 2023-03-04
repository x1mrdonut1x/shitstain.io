export class StateMachine<T> {
  constructor(private state: T, private transitions: Record<string, { from: T[]; to: T }>) {}

  public transition(name: keyof typeof this.transitions) {
    const transition = this.transitions[name];
    if (transition.from.includes(this.state)) {
      this.state = transition.to;
    }
  }
}
