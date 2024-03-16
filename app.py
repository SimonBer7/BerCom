from flask import Flask, render_template, request, redirect, url_for, session
from flask_bcrypt import Bcrypt
import mysql.connector

app = Flask(__name__)
bcrypt = Bcrypt(app)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# Connect to MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="bercom"
)

cursor = db.cursor()

@app.route('/', methods=['GET'])
def index_form():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup_form():
    if request.method == 'POST':
        # Retrieve form data
        last_name = request.form.get('last_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm-password')

        # Check if passwords match
        if password != confirm_password:
            return "Passwords do not match. Please try again."

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Insert user data into the database
        sql = "INSERT INTO user (last_name, email, password) VALUES (%s, %s, %s)"
        val = (last_name, email, hashed_password)
        cursor.execute(sql, val)
        db.commit()

        # Redirect the user to the login page
        return redirect(url_for('login_form'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login_form():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Retrieve user data from the database based on the provided email
        sql = "SELECT id, last_name, email, password FROM user WHERE email = %s"
        cursor.execute(sql, (email,))
        user = cursor.fetchone()

        if user:
            # Verify the password
            if bcrypt.check_password_hash(user[3], password):
                # Store user data in session
                session['user_id'] = user[0]
                session['last_name'] = user[1]
                session['email'] = user[2]
                
                # Redirect the user to the dashboard or any other page
                return redirect(url_for('index_form'))
            else:
                return "Incorrect email or password. Please try again."
        else:
            return "User with this email does not exist. Please sign up first."

    return render_template('login.html')

@app.route('/logout')
def logout():
    # Clear the session data
    session.clear()
    # Redirect the user to the index page or any other desired page
    return redirect(url_for('index_form'))


@app.route('/about', methods=['GET'])
def about_form():
    return render_template('about.html')

@app.route('/products', methods=['GET'])
def products_form():
    return render_template('products.html')

@app.route('/service', methods=['GET'])
def service_form():
    return render_template('service.html')

@app.route('/contact', methods=['GET'])
def contact_form():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)
