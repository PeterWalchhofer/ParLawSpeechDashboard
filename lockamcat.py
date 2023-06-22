from amcat4py import AmcatClient

admin = "admin@opted.eu"

host = "http://localhost/amcat"

client = AmcatClient(host)

client.login()

indices = client.list_indices()

for index in indices:
    client.modify_index_user(index['id'], "guest_role", "reader")
    client.modify_index_user(index['id'], "guest", "reader")
    client.modify_index_user(index['id'], admin, "admin")