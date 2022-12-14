import sqlite3, json
from sqlite3 import Error

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

def open_connection(db_file):
    """ create a database connection to a SQLite database """
    return sqlite3.connect(db_file)



class Device(dict):
    def __init__(self, name, brand):
        dict.__init__(self, name=name, brand=brand, screens=[])

    
    def create(self, conn):
        sql = '''INSERT INTO device(name, brand)
                VALUES(?,?) '''
        cur = conn.cursor()
        cur.execute(sql, (self.name, self.brand))
        conn.commit()
        self.id = cur.lastrowid
    
    def append(self, screen):
        self['screens'].append(screen)

    def append_screen(self, conn, screen):
        sql = '''INSERT INTO device_screen(device, screen)
                VALUES(?,?) '''
        cur = conn.cursor()
        cur.execute(sql, (self.id, screen.id))
        conn.commit()


class Screen(dict):
    def __init__(self, width, height, density):
        dict.__init__(self, width=width, height=height, density=density)

    def get_screen(self, conn):
        sql = '''SELECT rowid FROM screen WHERE
                width = ? AND height = ? AND density = ? '''
        cur = conn.cursor()
        cur.execute(sql, (self.width, self.height, self.density))
        return cur.fetchone()

    def create(self, conn):
        id = self.get_screen(conn)
        if id is None:
            sql = '''INSERT INTO screen(width, height, density)
                    VALUES(?,?,?) '''
            cur = conn.cursor()
            cur.execute(sql, (self.width, self.height, self.density))
            conn.commit()
            self.id = cur.lastrowid
        else:
            self.id = id[0]

        

def process_file(file, brand):
    db = { }
    db[brand] = []
    with open(file) as f:
        lines = [l.strip() for l in f.readlines()]
        count = 0
        total = len(lines)
        # conn = open_connection(r"./public/devices.db")
        for l in lines:
            columns = l.split(';')
            name = columns[0]
            device = Device(name, brand)
            screens = [columns[i:i+3] for i in range(1, len(columns), 3)]
            for s in screens:
                screen = Screen(s[0], s[1], s[2])
                device.append(screen)
            db[brand].append(device)
            count +=1
            print("Device %d from %d" % (count, total))
    return db


            


if __name__ == '__main__':
    db = process_file("./oppo.txt", "Oppo")
    current = {}
    with open("./src/catalog.json", "r") as f:
        current = json.load(f)
    db = current | db
    with open("./src/catalog.json", "w") as f:
        json.dump(db, f, indent=4)
    # create_connection(r"./public/devices.db")