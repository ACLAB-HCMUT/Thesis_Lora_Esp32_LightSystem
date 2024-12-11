PERIOD_TICK = 10    # unit: ms

class MyTimer:
    def __init__(self, id, duration):
        # duration's unit: ms
        self.id = id
        self.max_counter = duration / PERIOD_TICK
        self.counter = self.max_counter
        self.flag = False
        
    def getFlag(self):
        if self.flag:
            self.flag = False
            return True
        return False
    
    def update(self):
        if self.counter > 0:
            self.counter -= 1
        else:
            self.counter = self.max_counter
            self.flag = True
        
    def setDuration(self, duration):
        self.max_counter = duration / PERIOD_TICK
    
def timerCallback(timer):
    global timer_vector
    for timer_obj in timer_vector:
        timer_obj.update()

def set_timer(timer_id, duration):
    global timer_vector
    my_timer = None
    for timer_obj in timer_vector:
        if timer_obj.id == timer_id:
            my_timer = timer_obj
            break
    if my_timer is None:
        timer_vector.append(MyTimer(timer_id, duration))
    else:
        my_timer.setDuration(duration)

def init_software():
    global timer_vector
    timer_vector = []
    