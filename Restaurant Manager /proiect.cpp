#include <fstream>
#include <iostream>
#include <sstream>
#include <vector>
#include <string.h>
#include <map>
#include <set>
#include <list>
using namespace std;

class Virtualizare {
public:
    virtual void citesteBinar(istream &in) = 0;
    virtual void scrieBinar(ostream &out) const = 0;
    virtual ~Virtualizare() {}
};

class Ingrediente : public Virtualizare
{
    int nrIngrediente = 0;
    string *matPrim = nullptr;
    float *stoc = nullptr; // in grame

public:
    Ingrediente()
    {
        
    }

    Ingrediente(int nrIngrediente, string *ingredients, float *stoc)
    {
        if (nrIngrediente > 0)
            this->nrIngrediente = nrIngrediente;
        this->matPrim = new string[nrIngrediente];
        if ((matPrim != nullptr) && (nrIngrediente > 0))
        {
            for (int i = 0; i < this->nrIngrediente; i++)
                this->matPrim[i] = ingredients[i];
        }
        if (stoc != nullptr)
        {
            this->stoc = new float[nrIngrediente];
            for (int i = 0; i < this->nrIngrediente; i++)
                this->stoc[i] = stoc[i];
        }
    }

    bool verificaDisp(const string &matPrim, int cantitate) const
    {
        for (int i = 0; i < nrIngrediente; i++)
        {
        if (this->matPrim[i] == matPrim && this->stoc[i] >= cantitate)
            {
                return true;
            }
        }
        return false;
    }

    bool consumeIngredient(const string &ingredient, int cantitate)
    {
        for (int i = 0; i < this->nrIngrediente; i++)
        {
            if (this->matPrim[i] == ingredient && this->stoc[i] >= cantitate)
            {
                this->stoc[i] -= cantitate;
                return true;
            }
        }
        return false;
    }

    void incarcareStoc(string stocIngredient, int incarcare)
    {
        bool gasit = false;
        for (int i = 0; i < this->nrIngrediente; i++)
            if (this->matPrim[i] == stocIngredient && incarcare > 0)
                gasit = true;
        if (gasit)
        {
            for (int i = 0; i < nrIngrediente; i++)
                if (this->matPrim[i] == stocIngredient)
                    this->stoc[i] += incarcare;
        }
    }

    void descarcareStoc(string stocIngrediente, float descarcare)
    {
        bool gasit = false;
        int vf = 0, index = 0;
        for (int i = 0; i < nrIngrediente; i++)
            if (this->matPrim[i] == stocIngrediente && descarcare > 0)
                gasit = true;
        if (gasit)
        {
            for (int i = 0; i < nrIngrediente; i++)
                if (this->matPrim[i] == stocIngrediente)
                {
                    this->stoc[i] -= descarcare;
                    vf = this->stoc[i];
                    index = i;
                }
            if (vf <= 0)
            {
                for (int j = index; j < nrIngrediente; j++)
                {
                    this->matPrim[j] = this->matPrim[j + 1];
                    this->stoc[j] = this->stoc[j + 1];
                }
                nrIngrediente--;
            }
        }
    }

    void adaugaIngredient(string nouIngredient, float nouStoc)
    {
        if (nouIngredient.length() > 0 && nouStoc > 0)
        {
            string *nouIngredientArr = new string[nrIngrediente + 1];
            for (int i = 0; i < nrIngrediente; i++)
                nouIngredientArr[i] = this->matPrim[i];
            nouIngredientArr[nrIngrediente] = nouIngredient;

            float *nouStocArr = new float[nrIngrediente + 1];
            for (int i = 0; i < nrIngrediente; i++)
                nouStocArr[i] = this->stoc[i];
            nouStocArr[nrIngrediente] = nouStoc;
            delete[] this->matPrim;
            delete[] this->stoc;
            matPrim = nouIngredientArr;
            stoc = nouStocArr;
            nrIngrediente++;
        }
    }

    void stergeIngrediente(string ingredientSters)
    {
        bool gasit = false;
        for (int i = 0; i < this->nrIngrediente; i++)
            if (this->matPrim[i] == ingredientSters)
            {
                gasit = true;
                for (int j = i; j < nrIngrediente; j++)
                {
                    this->matPrim[j] = this->matPrim[j + 1];
                    this->stoc[j] = this->stoc[j + 1];
                }
            }
            else
                gasit = false;
        if (gasit)
            nrIngrediente--;
    }

    int getNrIng(int ingredientIndex)
    {
        if (ingredientIndex >= 0 && ingredientIndex < nrIngrediente)
            return this->nrIngrediente;
        return -1;
    }

    string getIngredient(int ingredientIndex)
    {
        if (ingredientIndex >= 0 && ingredientIndex < nrIngrediente)
            return this->matPrim[ingredientIndex];
        return "";
    }

    float getStoc(int ingredientIndex)
    {
        if (ingredientIndex >= 0 && ingredientIndex < nrIngrediente)
            return this->stoc[ingredientIndex];
        return -1;
    }

    int getIngredientCount()
    {
        return this->nrIngrediente;
    }

    void setIngredientCount(int ingredientCount)
    {
        if (ingredientCount > 0)
            this->nrIngrediente = ingredientCount;
    }

    Ingrediente(const Ingrediente &g)
    {
        this->nrIngrediente = g.nrIngrediente;
        this->matPrim = new string[g.nrIngrediente];
        for (int i = 0; i < g.nrIngrediente; i++)
            this->matPrim[i] = g.matPrim[i];
        this->stoc = new float[g.nrIngrediente];
        for (int i = 0; i < g.nrIngrediente; i++)
            this->stoc[i] = g.stoc[i];
    }

    Ingrediente &operator=(const Ingrediente &g) {
        if (this != &g) {
            delete[] this->matPrim;
            delete[] this->stoc;

            this->nrIngrediente = g.nrIngrediente;

            this->matPrim = new string[g.nrIngrediente];
            for (int i = 0; i < g.nrIngrediente; i++)
                this->matPrim[i] = g.matPrim[i];

            this->stoc = new float[g.nrIngrediente];
            for (int i = 0; i < g.nrIngrediente; i++)
                this->stoc[i] = g.stoc[i];
        }
        return *this;
    }

    ~Ingrediente()
    {
        delete[] this->matPrim;
        this->matPrim = nullptr;
        delete[] this->stoc;
        this->stoc = nullptr;
    }

    friend ostream &operator<<(ostream &out, const Ingrediente &g)
    {
        out << "\n--------OSTREAM------------\n";
        out << "Numar de ingrediente: " << g.nrIngrediente << endl;
        if (g.nrIngrediente > 0)
        {
            out << "Ingrediente:\n";
            for (int i = 0; i < g.nrIngrediente; i++)
                out << "   - " << g.matPrim[i] << " - Stoc: " << g.stoc[i] << " grame" << endl;
        }
        else
            out << "Nu exista ingrediente disponibile!\n";
        return out;
    }

    friend istream &operator>>(istream &in, Ingrediente &g)
    {
        cout << "Numarul de ingrediente: ";
        in >> g.nrIngrediente;
        if (g.nrIngrediente > 0)
        {
            g.matPrim = new string[g.nrIngrediente];
            g.stoc = new float[g.nrIngrediente];
            for (int j = 0; j < g.nrIngrediente; j++)
            {
               cout << "Numele ingredientului " << j + 1 << ": ";
                in >> g.matPrim[j];
                do
                {
                    cout << "Stocul pentru ingredientul " << j + 1 << " (in grame): ";
                    in >> g.stoc[j];
                    if (g.stoc[j] <= 0)
                    {
                        cout << "Stocul trebuie sa fie mai mare decat 0. Reintroduceti.\n";
                    }
                } while (g.stoc[j] <= 0);
            }
        }
        else
            cout << "Numarul de ingrediente nu poate fi nul!.\n";
        return in;
    }

	void scrieCSV(const string& numeFisier) {
    ofstream file(numeFisier);
    if (!file.is_open()) {
        cerr << "Fisierul nu poate fi deschis pentru scriere " << numeFisier << endl;
        return;
    }

    file << "Ingredient,Stoc(g)" << endl;
    for (int i = 0; i < nrIngrediente; ++i) {
        file << matPrim[i] << "," << stoc[i] << endl;
    }

    file.close();
    cout << "Datele au fost scrise in fisierul CSV." << endl;
}


     void scrieDinCSV(string numeFisier) {
        ifstream file(numeFisier);
        if (!file.is_open()) {
            cerr << "Fisierul nu poate fi deschis " << numeFisier << endl;
            return;
        }

        string line;
        int lineCount = 0;
        while (getline(file, line)) {
            lineCount++;
        }

        file.clear(); 
        file.seekg(0, ios::beg);

        if (file.is_open()) {
            this->nrIngrediente = lineCount;
            delete[] this->matPrim;
            delete[] this->stoc;
            this->matPrim = new string[lineCount];
            this->stoc = new float[lineCount];

            int index = 0;
            while (getline(file, line)) {
                size_t pos = line.find(",");
                if (pos != string::npos) {
                    string name = line.substr(0, pos);
                    string stockStr = line.substr(pos + 1);
                    try {
                        this->matPrim[index] = name;
                        this->stoc[index] = stof(stockStr);
                        index++;
                    } catch (const invalid_argument& e) {
                        cerr << "Error parsing stock value in line " << index + 1 << ": " << e.what() << endl;
                    }
                } else {
                    cerr << "Error: Invalid CSV format in line " << index + 1 << endl;
                }
            }
        } else {
            cerr << "Error: Could not open file after counting lines." << endl;
        }

        file.close();
    }

   friend ofstream& operator<<(ofstream& out,const Ingrediente& g)
    {
        out << "\n--------OSTREAM------------\n";
        out << "Numar de ingrediente: " << g.nrIngrediente << endl;
        if (g.nrIngrediente > 0)
        {
            out << "Ingrediente:\n";
            for (int i = 0; i < g.nrIngrediente; i++)
                out << "   - " << g.matPrim[i] << " - Stoc: " << g.stoc[i] << " grame" << endl;
        }
        else
            out << "Nu exista ingrediente disponibile!\n";
        return out;
    }

   friend ifstream& operator>>(ifstream& fi, Ingrediente& ing) {
   fi >> ing.nrIngrediente;

    delete[] ing.matPrim;
    delete[] ing.stoc;

    ing.matPrim = new string[ing.nrIngrediente];
    ing.stoc = new float[ing.nrIngrediente];

    for (int i = 0; i < ing.nrIngrediente; i++) {
        fi >> ing.matPrim[i] >> ing.stoc[i];
    }

    return fi;
}


 void citesteBinar(istream &in) override {
        in.read(reinterpret_cast<char*>(&nrIngrediente), sizeof(int));
        matPrim = new string[nrIngrediente];
        stoc = new float[nrIngrediente];
        for (int i = 0; i < nrIngrediente; ++i) {
            int sz;
            in.read(reinterpret_cast<char*>(&sz), sizeof(int));
            char buffer[sz];
            in.read(buffer, sz);
            matPrim[i] = string(buffer, sz);
            in.read(reinterpret_cast<char*>(&stoc[i]), sizeof(float));
        }
    }

 void scrieBinar(ostream &out) const override {
        out.write(reinterpret_cast<const char*>(&nrIngrediente), sizeof(int));
        for (int i = 0; i < nrIngrediente; ++i) {
            int sz = matPrim[i].size();
            out.write(reinterpret_cast<const char*>(&sz), sizeof(int));
            out.write(matPrim[i].c_str(), sz);
            out.write(reinterpret_cast<const char*>(&stoc[i]), sizeof(float));
        }
    }


    Ingrediente &operator++() //post
    {
        ++nrIngrediente;
        return *this;
    }

    Ingrediente operator++(int) //pre
    {
        Ingrediente temp = *this;
        ++(*this);
        return temp;
    }

    Ingrediente &operator--() //post
    {
        if (nrIngrediente > 0)
            --nrIngrediente;
        return *this;
    }

    Ingrediente operator--(int) //pre
    {
        Ingrediente temp = *this;
        --(*this);
        return temp;
	}


};

class Retete
{
private:
    int nrRetete = 0;
    string *retete = nullptr;
    int *nrIngrediente = nullptr;
    string *ingrediente = nullptr;
    Ingrediente *ingredient = nullptr;
    int *durata = nullptr;
    float *stoc = nullptr;

public:
    Retete()
    {
    }

    Retete(int nrRetete, string *ing, float *stoc, string *recipes, int *numIng, int *durata)
    {
        if (nrRetete > 0)
            this->nrRetete = nrRetete;
        this->retete = new string[nrRetete];
        
        if ((recipes != nullptr) && (nrRetete > 0))
        {
            for (int i = 0; i < this->nrRetete; i++)
                this->retete[i] = retete[i];
        }
        
        if (numIng != nullptr && ing != nullptr && stoc != nullptr)
        {
            this->nrIngrediente = new int[nrRetete];
            this->ingrediente = new string[nrRetete];
            this->stoc = new float[nrRetete];
            for (int i = 0; i < this->nrRetete; i++)
            {
                this->stoc[i] = stoc[i];
                this->ingrediente[i] = ing[i];
                this->nrIngrediente[i] = numIng[i];
            }
        
        }

        if (durata != nullptr)
            this->durata = new int[nrRetete];
        for (int i = 0; i < this->nrRetete; i++)
            this->durata[i] = durata[i];
        
    }

    Retete(const Retete &r)
    {
        this->nrRetete = r.nrRetete;
        this->retete = new string[r.nrRetete];
        for (int i = 0; i < r.nrRetete; i++)
            this->retete[i] = r.retete[i];
        this->nrIngrediente = new int[r.nrRetete];
        this->ingrediente = new string[nrRetete];
        this->stoc = new float[nrRetete];
        for (int i = 0; i < r.nrRetete; i++)
        {
            this->ingrediente[i] = r.ingrediente[i];
            this->nrIngrediente[i] = r.nrIngrediente[i];
            this->stoc[i] = r.stoc[i];
        }
        this->durata = new int[r.nrRetete];
        for (int i = 0; i < r.nrRetete; i++)
            this->durata[i] = r.durata[i];
    }

    int getNrRetete()
    {
        return this->nrRetete;
    }

    int getDuration(int recipeIndex)
    {
        if (recipeIndex >= 0 && recipeIndex < nrRetete)
            return this->durata[recipeIndex];
        return -1;
    }

    int getNumIngrediente(int recipeIndex)
    {
        if (recipeIndex >= 0 && recipeIndex < nrRetete)
            return this->nrIngrediente[recipeIndex];
        return -1;
    }

    string getIngredients(int recipeIndex)
    {
        if (recipeIndex >= 0 && recipeIndex < nrRetete)
            return this->ingrediente[recipeIndex];
        else
            return "";
    }

    string getRecipes(int recipeIndex)
    {
        if (recipeIndex >= 0 && recipeIndex < nrRetete)
            return this->ingrediente[recipeIndex];
        else
            return "";
    }

    int getNumIng(int recipeIndex)
    {
        if (recipeIndex >= 0 && recipeIndex < nrRetete)
            return this->nrIngrediente[recipeIndex];
        return -1;
    }

    float getStock(int recipeIndex)
    {
        if (recipeIndex >= 0 && recipeIndex < nrRetete)
            return this->stoc[recipeIndex];
        return -1;
    }


    void checkIngredients()
    {
    }

~Retete()
    {
        delete[] this->retete;
        this->retete = nullptr;
        delete[] this->nrIngrediente;
        this->nrIngrediente = nullptr;
        delete[] this->ingredient;
        this->ingredient = nullptr;
        delete[] this->ingrediente;
        this->ingrediente = nullptr;
        delete[] this->stoc;
        this->stoc = nullptr;
    }

 friend ostream &operator<<(ostream &out, const Retete &r)
    {
        out << "\n--------OSTREAM------------\n";
        out << "\nNumar de retete:: " << r.nrRetete << endl;

        if (r.nrRetete > 0)
        {
            out << "Retete:\n";

            for (int i = 0; i < r.nrRetete; i++)
            {
                out << r.retete[i] << "   "
                    << " - Durata: " << r.durata[i] << " minute" << endl;
                out << "Ingrediente: " << r.retete[i] << endl;

                for (int j = 0; j < r.nrIngrediente[i]; j++)
                    out << "    - " << r.ingrediente[j] << "  -  " << r.stoc[j] << " grame" << endl;
            }
            out << endl;
        }
        else
        {
            out << "Nu exista retete!\n";
        }

        return out;
    }

friend ofstream &operator<<(ofstream &out, const Retete &r)
    {
       out << "\n--------OSTREAM------------\n";
        out << "\nNumar de retete:: " << r.nrRetete << endl;

        if (r.nrRetete > 0)
        {
            out << "Retete:\n";

            for (int i = 0; i < r.nrRetete; i++)
            {
                out << r.retete[i] << "   "
                    << " - Durata: " << r.durata[i] << " minute" << endl;
                out << "Ingrediente: " << r.retete[i] << endl;

                for (int j = 0; j < r.nrIngrediente[i]; j++)
                    out << "    - " << r.ingrediente[j] << "  -  " << r.stoc[j] << " grame" << endl;
            }
            out << endl;
        }
        else
        {
            out << "Nu exista retete!\n";
        }

        return out;
    }

 friend istream &operator>>(istream &in, Retete &r)
{

    r.ingrediente = nullptr;
    r.stoc = nullptr;

    cout << "Numar de retete; ";
    in >> r.nrRetete;

    
    r.durata = new int[r.nrRetete];
    r.nrIngrediente  = new int[r.nrRetete];
    r.retete = new string[r.nrRetete];

    if (r.nrRetete > 0)
    {
        for (int i = 0; i < r.nrRetete; i++)
        {
            cout << "\nNumele retetei: " << i + 1 << ": ";
            in >> r.retete[i];

            cout << "\nDurata de preparare: " << r.retete[i] << " (in minute): ";
            in >> r.durata[i];

            do
            {
                cout << "\nNumarul de ingrediente pentru reteta! " << r.retete[i] << ": ";
                in >> r.nrIngrediente[i];
                if (r.nrIngrediente[i] <= 0)
                    cout << "\nNumarul de ingrediente trebuie sa fie mai mare decat 0!\n";
            } while (r.nrIngrediente[i] <= 0);

            r.ingrediente = new string[r.nrIngrediente[i]];
            r.stoc = new float[r.nrIngrediente[i]];

            cout << "\nNumarul de ingrediente  " << r.retete[i] << ":\n";
            for (int j = 0; j < r.nrIngrediente[i]; j++)
            {
                cout << "\nIngredientul: " << j + 1 << ": ";
                in >> r.ingrediente[j];

                cout << "\nGramaj pt ingredientul: " << j + 1 << ": ";
                in >> r.stoc[j];
            }
        }
    }
    else
    {
        cout << "\nNumarul de retete trebuie sa fie mai mare ca 0!.\n";
    }

    return in;
}

friend ifstream& operator>>(ifstream& in, Retete& r) {
    in >> r.nrRetete;
    r.durata = new int[r.nrRetete];
    r.nrIngrediente  = new int[r.nrRetete];
    r.retete = new string[r.nrRetete];

    for (int i = 0; i < r.nrRetete; i++) {
        in >> r.retete[i] >> r.durata[i] >> r.nrIngrediente[i];

        r.ingrediente = new string[r.nrIngrediente[i]];
        r.stoc = new float[r.nrIngrediente[i]];
        for (int j = 0; j < r.nrIngrediente[i]; j++)
            {
                in >> r.ingrediente[j] >> r.stoc[j];
            }
    }

    return in;
}

void salveazaInFisierBin(const string& numeFisier)  {
        ofstream file(numeFisier, ios::binary);
        if (file.is_open()) {
            file.write(reinterpret_cast<char*>(&nrRetete), sizeof(int));
            for (int i = 0; i < nrRetete; ++i) {
                int sz = retete[i].size();
                file.write(reinterpret_cast<char*>(&sz), sizeof(int));
                file.write(reinterpret_cast<char*>(&retete[i][0]), sz);
                file.write(reinterpret_cast<char*>(&durata[i]), sizeof(int));
                file.write(reinterpret_cast<char*>(&nrIngrediente[i]), sizeof(int));
                for (int j = 0; j < nrIngrediente[i]; ++j) {
                    sz = ingrediente[j].size();
                    file.write(reinterpret_cast<char*>(&sz), sizeof(int));
                    file.write(reinterpret_cast<char*>(&ingrediente[j][0]), sz);
                    file.write(reinterpret_cast<char*>(&stoc[j]), sizeof(float));
                }
            }
            file.close();
            cout << "Datele au fost salvate in fisierul binar." << endl;
        } else {
            cerr << "Eroare: Fisierul binar nu poate fi deschis pentru scriere." << endl;
        }
    }

void CSVRet(const string& numeFisier, char separator = ',') {
    ofstream file(numeFisier);
    if (!file.is_open()) {
        cerr << "Fisierul nu poate fi deschis pentru scriere " << numeFisier << endl;
        return;
    }

    file << "Numar retete" << separator << "Nume reteta" << separator << "Durata" << separator
         << "Numar ingrediente" << separator << "Ingrediente" << separator << "Stoc" << endl;

    for (int i = 0; i < nrRetete; ++i) {
        file << nrRetete << separator << retete[i] << separator << durata[i] << separator
             << nrIngrediente[i] << separator;

        for (int j = 0; j < nrIngrediente[i]; ++j) {
            file << ingrediente[j] << separator << stoc[j];
            if (j < nrIngrediente[i] - 1) {
                file << separator;
            }
        }
        file << endl;
    }

    file.close();
    cout << "Datele au fost scrise in fisierul CSV." << endl;
}

void citireCSVRet(const string& numeFisier, char separator = ',') {
    ifstream file(numeFisier);
    if (!file.is_open()) {
        cerr << "Fisierul nu poate fi deschis " << numeFisier << endl;
        return;
    }

    string line;
    int lineCount = 0;
    while (getline(file, line)) {
        lineCount++;
    }

    file.clear();
    file.seekg(0, ios::beg);

    if (file.is_open()) {
        this->nrRetete = lineCount;
        delete[] this->retete;
        delete[] this->durata;
        delete[] this->nrIngrediente;
        delete[] this->ingrediente;
        delete[] this->stoc;
        this->retete = new string[lineCount];
        this->durata = new int[lineCount];
        this->nrIngrediente = new int[lineCount];
        this->ingrediente = new string[lineCount];
        this->stoc = new float[lineCount];

        int index = 0;
        while (getline(file, line)) {
            stringstream ss(line);
            string token;
            getline(ss, token, separator); 
            this->retete[index] = token;

            getline(ss, token, separator); 
            try {
                this->durata[index] = stoi(token);
                this->ingrediente[index] = stoi(token);
            } catch (const invalid_argument &e) {
                cerr << "Eroare in preluarea duratei." << index + 1 << ": " << e.what() << endl;
            }
            index++;
        }
    } else {
        cerr << "Eroare" << endl;
    }

    file.close();
}

bool operator==(const Retete &recipe1) const
    {
        if (this->nrRetete != recipe1.nrRetete)
        {
            return false;
        }
        for (int i = 0; i < this->nrRetete; ++i)
        {
            if (this->retete[i] != recipe1.retete[i] ||
                this->durata[i] != recipe1.durata[i] ||
                this->nrIngrediente[i] != recipe1.nrIngrediente[i])
            {
                return false;
            }

            for (int j = 0; j < this->nrIngrediente[i]; ++j)
            {
                if (this->ingrediente[j] != recipe1.ingrediente[j] || this->stoc[j] != recipe1.stoc[j])
                    return false;
            }
        }
        return true;
    }

Retete &operator=(const Retete &other) {
        if (this != &other) {
            // Deallocate existing memory
            delete[] this->retete;
            delete[] this->nrIngrediente;
            delete[] this->ingredient;
            delete[] this->ingrediente;
            delete[] this->stoc;
            delete[] this->durata;

            this->nrRetete = other.nrRetete;  
            this->retete = new string[this->nrRetete];
            for (int i = 0; i < this->nrRetete; i++)
            this->retete[i] = other.retete[i];
            this->nrIngrediente = new int[this->nrRetete];
            for (int i = 0; i < this->nrRetete; i++)
                this->nrIngrediente[i] = other.nrIngrediente[i];
         
            this->ingrediente = new string[this->nrRetete];
            for (int i = 0; i < this->nrRetete; i++)
                this->ingrediente[i] = other.ingrediente[i];

            this->stoc = new float[this->nrRetete];
            for (int i = 0; i < this->nrRetete; i++)
                this->stoc[i] = other.stoc[i];
            this->durata = new int[this->nrRetete];
            for (int i = 0; i < this->nrRetete; i++)
                this->durata[i] = other.durata[i];


        }
        return *this;
    }

};

class Preparate
{
private:
    string *preparate = nullptr;
    int nrPreparate = 0;
    Retete *retetar = nullptr;
    float *preturi = nullptr;

public:
    Preparate()
    {
    }

    Preparate(int nrPrep, string *preparate, Retete *retetar, float *preturi)
    {
        if (nrPrep > 0)
        {
            this->nrPreparate = nrPrep;
            this->preparate = new string[nrPrep];
            
            for (int i = 0; i < nrPrep; i++)
                this->preparate[i] = preparate[i];
            
            if (retetar != nullptr)
                this->retetar = retetar;
            
            this->preturi = new float[nrPrep];
            if (this->preturi != nullptr)
            {
                for (int i = 0; i < nrPrep; i++)
                    this->preturi[i] = preturi[i];
            }
            
        }
    }

    Preparate(const Preparate &d)
    {
        if (nrPreparate > 0)
        {
            this->nrPreparate = d.nrPreparate;
            this->preparate = new string[d.nrPreparate];
            for (int i = 0; i < d.nrPreparate; i++)
                this->preparate[i] = d.preparate[i];
            this->retetar = new Retete[d.nrPreparate];
            if (d.retetar != nullptr)
            {
                for (int i = 0; i < d.nrPreparate; i++)
                    this->retetar[i] = d.retetar[i];
            }
            this->preturi = new float[d.nrPreparate];
            if (this->preturi != nullptr)
            {
                for (int i = 0; i < d.nrPreparate; i++)
                    this->preturi[i] = d.preturi[i];
            }
        }
    }

    bool verificaPreparat(const string &dishName)
    {
        for (int i = 0; i < this->nrPreparate; i++)
            if (this->preparate[i] == dishName)
                return true;
        return false;
    }

    int getNrPrep()
    {
        return this->nrPreparate;
    }

    string getPreparat(int index)
    {
        if (index >= 0 && index < nrPreparate)
            return this->preparate[index];
        else
            return "";
    }

    float getPrices(int dishIndex)
    {
        if (dishIndex >= 0 && dishIndex < nrPreparate)
            return this->preturi[dishIndex];
        else
            return 0;
    }

    int getNumIngredients(int dishIndex)
    {
        if (dishIndex >= 0 && dishIndex < nrPreparate)
            return this->retetar[dishIndex].getNumIngrediente(dishIndex);
        else
            return 0;
    }

    string getIngredients(int dishIndex)
    {
        if (dishIndex >= 0 && dishIndex < nrPreparate)
            return this->retetar[dishIndex].getIngredients(dishIndex);
        else
            return "";
    }

    string getReteta(int prepIndex)
    {
        if (prepIndex >= 0 && prepIndex < nrPreparate)
            return this->retetar[prepIndex].getRecipes(prepIndex);
        else
            return "";
    }

    void setNrPrep(int dishCount)
    {
        if (dishCount > 0)
            this->nrPreparate = dishCount;
    }

    void modificaPrep(int prepIndex, string numePrep)
    {
        if (prepIndex >= 0 && prepIndex < nrPreparate)
            this->preparate[prepIndex] = numePrep;
    }

    void addDish(const string &numePrep, float pret, const Retete &ret)
    {
        if (numePrep.length() > 0)
        {
            string *nouPrep = new string[this->nrPreparate + 1];
            float *nouPret = new float[this->nrPreparate + 1];
            Retete *nouRetete = new Retete[this->nrPreparate + 1];

            for (int i = 0; i < this->nrPreparate; i++)
            {
                nouPrep[i] = this->preparate[i];
                nouPret[i] = this->preturi[i];
                nouRetete[i] = this->retetar[i];
            }

            nouPrep[nrPreparate] = numePrep;
            nouPret[nrPreparate] = pret;
            nouRetete[nrPreparate] = ret;

            delete[] this->preparate;
            this->preparate = nullptr;
            delete[] this->preturi;
            this->preturi = nullptr;
            delete[] this->retetar;
            this->retetar = nullptr;

            preparate = nouPrep;
            preturi = nouPret;
            retetar = nouRetete;

            nrPreparate++;
        }
    }

    Preparate &operator=(const Preparate &d)
    {
        if (this != &d)
        {
            delete[] this->preparate;
            
            this->preparate = nullptr;
            delete[] this->retetar;
            this->retetar = nullptr;
            
            delete[] this->preturi;
            this->preturi = nullptr;
            this->nrPreparate = d.nrPreparate;
            
            cout<<d.nrPreparate<<endl;
            
            this->preparate = new string[d.nrPreparate];
            for (int i = 0; i < d.nrPreparate; i++)
                this->preparate[i] = d.preparate[i];
            
            this->retetar = d.retetar;
            
            this->preturi = new float[d.nrPreparate];
            for (int i = 0; i < d.nrPreparate; i++)
                this->preturi[i] = d.preturi[i];
        }
        return *this;
    }

    ~Preparate()
    {
        delete[] this->preparate;
        this->preparate = nullptr;
        delete[] this->retetar;
        this->retetar = nullptr;
        delete[] this->preturi;
        this->preturi = nullptr;
    }

    friend ostream &operator<<(ostream &out, const Preparate &d)
    {
        out << "\n--------OSTREAM------------\n";
        out << "Numar de preparate: " << d.preparate << endl;

        if (d.nrPreparate > 0)
        {
            out << "Preparate:\n";
            for (int i = 0; i < d.nrPreparate; i++)
            {
                out << " -  " << d.preparate[i] << " - Pret: " << d.preturi[i] << " lei" << endl;

                out << "Reteta: " << d.preparate[i] << endl;

                for (int j = 0; j < d.retetar->getNumIng(i); j++)
                    out << "      - " << d.retetar->getIngredients(j) << "  -  " << d.retetar->getStock(j) << " grams" << endl;
            }
            out << endl;
        }
        else
            out << "Niciun preparat disponibil!\n";

        return out;
    }

    friend istream &operator>>(istream &in, Preparate &d)
    {
       cout << "\n--------ISTREAM------------\n";
        cout << "\nNr de preparate: ";
        in >> d.nrPreparate;
        d.preparate = new string[d.nrPreparate];
        d.preturi = new float[d.nrPreparate];
        for (int i = 0; i < d.nrPreparate; i++)
        {
            cout << "\nEnter the name of dish " << i + 1 << ": ";
            in >> d.preparate[i];
            cout << "\nEnter the price of dish " << i + 1 << ": ";
            in >> d.preturi[i];
        }
        return in;
    }

	friend ifstream &operator>>(ifstream &in, Preparate &d) {
    in >> d.nrPreparate;
    d.preparate = new string[d.nrPreparate];
    d.preturi = new float[d.nrPreparate];
    for (int i = 0; i < d.nrPreparate; ++i) {
        in >> d.preparate[i] >> d.preturi[i];
    }
    return in;
    }

    friend ofstream &operator<<(ofstream out, const Preparate&d)
    {
		 out << "Numar de preparate: " << d.preparate << endl;

        if (d.nrPreparate > 0)
        {
            out << "Preparate:\n";
            for (int i = 0; i < d.nrPreparate; i++)
            {
                out << " -  " << d.preparate[i] << " - Pret: " << d.preturi[i] << " lei" << endl;

                out << "Reteta: " << d.preparate[i] << endl;

                for (int j = 0; j < d.retetar->getNumIng(i); j++)
                    out << "      - " << d.retetar->getIngredients(j) << "  -  " << d.retetar->getStock(j) << " grams" << endl;
            }
            out << endl;
        }
        else
            out << "Niciun preparat disponibil!\n";

        return out;

    }

	void scrieTXTPrep(const string& numeFisier) {
    ofstream file(numeFisier);
    if (!file.is_open()) {
        cerr << "Eroare: Fișierul nu poate fi deschis pentru scriere " << numeFisier << endl;
        return;
    }

	 file << "Numar de preparate: " << preparate << endl;

        if (nrPreparate > 0)
        {
            file << "Preparate:\n";
            for (int i = 0; i < nrPreparate; i++)
            {
                file << " -  " << preparate[i] << " - Pret: " << preturi[i] << " lei" << endl;

                file << "Reteta: " << preparate[i] << endl;

                for (int j = 0; j < retetar->getNumIng(i); j++)
                    file << "      - " << retetar->getIngredients(j) << "  -  " << retetar->getStock(j) << " grams" << endl;
            }
            file << endl;
        }
        else
            file << "Niciun preparat disponibil!\n";

    file.close();
    cout << "Datele au fost salvate in fisierul text." << endl;
}

   void salveazaInFisierBinar(const string& numeFisier) {
        ofstream file(numeFisier, ios::binary);
        if (file.is_open()) {
            file.write(reinterpret_cast<char*>(&nrPreparate), sizeof(int));
            for (int i = 0; i < nrPreparate; ++i) {
                int sz = preparate[i].size();
                file.write(reinterpret_cast<char*>(&sz), sizeof(int));
                file.write(reinterpret_cast<char*>(&preparate[i][0]), sz);
                file.write(reinterpret_cast<char*>(&preturi[i]), sizeof(float));
            }
            file.close();
            cout << "Datele au fost salvate in fisierul binar." << endl;
        } else {
            cerr << "Eroare: Fisierul binar nu poate fi deschis pentru scriere." << endl;
        }
    }

   void scrieCSVPrep(const string& numeFisier, char separator = ',') {
    ofstream file(numeFisier);
    if (!file.is_open()) {
        cerr << "Fisierul nu poate fi deschis pentru scriere " << numeFisier << endl;
        return;
    }

    file << " " << separator << "Nume preparat" << separator << "Pret" << separator
         << "Numar ingrediente" << separator << "Ingrediente" << endl;

    for (int i = 0; i < nrPreparate; ++i) {
        file << i << separator << preparate[i] << separator << preturi[i] << separator
             << retetar->getNumIng(i) << separator;

        for (int j = 0; j < retetar->getNumIng(i); ++j) {
            file << retetar->getIngredients(j) << separator << retetar->getStock(j);
        }
        file << endl;
    }

    file.close();
    cout << "Datele au fost salvate in fisierul CSV." << endl;
}

};

class Meniu { 
private:
    int nrPrep = 0;
    Preparate *prep = nullptr;
    Retete *ret = nullptr;

public:
    Meniu() {
    }

    Meniu(int nrPrep, Preparate *prep, Retete *ret) {
   
        if (nrPrep > 0)
            this->nrPrep = prep->getNrPrep();
        this->prep = prep;
        
        this->ret = ret;
        
    }

    Meniu(const Meniu &m) {
         this->nrPrep = prep->getNrPrep();
    this->prep = new Preparate[this->nrPrep];
    if (prep != nullptr) {
        for (int i = 0; i < this->nrPrep; i++)
            this->prep[i] = prep[i];
    }
    this->ret = new Retete[this->nrPrep];
    if (m.ret != nullptr) {
        for (int i = 0; i < this->nrPrep; i++)
            this->ret[i] = m.ret[i];
    }
    } 

    Meniu &operator=(const Meniu &m) {
        if (this != &m) {
        delete[] this->prep;
        this->prep = nullptr;
        delete[] this->ret;
        this->ret = nullptr;
        this->nrPrep = prep->getNrPrep();
        this->ret = new Retete[nrPrep];
        if (prep != nullptr) {
            for (int i = 0; i < nrPrep; i++)
                this->prep[i] = prep[i];
        }
        this->ret = new Retete[nrPrep];
        if (ret != nullptr) {
            for (int i = 0; i < nrPrep; i++)
                this->ret[i] = ret[i];
        }
    }
    return *this;
    }


    void displayDishesWithRecipes() const {
        if (nrPrep > 0) {
            for (int i = 0; i < nrPrep; i++) {
                cout << "Mancare: " << prep[i].getPreparat(i) << " - Pret: " << prep[i].getPrices(i) << endl;
                cout << "Reteta:" << prep[i].getPreparat(i) << ":\n" << prep[i].getReteta(i) << endl;
            }
        } else {
            cout << "Nu exista in meniu !\n";
        }
    }

    ~Meniu() {
        delete[] this->prep;
        this->prep = nullptr;
        delete[] this->ret;
        this->ret = nullptr;
    }

    friend istream &operator>>(istream &in, Meniu &m) {
        cout << "----------ISTREAM------------\n";
        cout << "\nCate produse contine meniul?: ";
        in >> m.nrPrep;
        m.prep = new Preparate[m.nrPrep];
        m.ret = new Retete[m.nrPrep];
        if (m.nrPrep > 0) {  
            cout << "Introduceti produsele din meniu :\n";
            for (int i = 0; i < m.nrPrep; i++) {
                cout << "Denumire: " << i + 1 << ": ";
                in >> m.prep[i];
                cout << "Reteta " << i + 1 << ": ";
                in >> m.ret[i];
            }
        } else
            cout << "Numarul produselor din meniu nu poate fi nul!.\n";

        return in;
    }

    friend ostream &operator<<(ostream &out, const Meniu &m) {
        out << "\nMeniu:\n"; 
        if (m.nrPrep > 0) { 
            for (int i = 0; i < m.nrPrep; i++) {
                out << "Preparat " << i + 1 << ": " << m.prep->getPreparat(i) << endl;
                out << "Reteta " << i + 1 << ": ";
                for (int j = 0; j < m.ret->getNumIng(i); j++) {
                    out << m.ret->getIngredients(j) << ", ";
                }
                out << "\nPret " << i + 1 << ": " << m.prep->getPrices(i) << " lei" << endl;
            }
        } else
            out << "Nu exista preparate in meniu!\n";
        return out;
    }

    friend ofstream& operator<<(ofstream &out, const Meniu &m) {
    out << "\nMeniu:\n"; 
        if (m.nrPrep > 0) { 
            for (int i = 0; i < m.nrPrep; i++) {
                out << "Preparat " << i + 1 << ": " << m.prep->getPreparat(i) << endl;
                out << "Reteta " << i + 1 << ": ";
                for (int j = 0; j < m.ret->getNumIng(i); j++) {
                    out << m.ret->getIngredients(j) << ", ";
                }
                out << "\nPret: " << m.prep->getPrices(i) << " lei" << endl;
            }
        } else
            out << "Nu exista preparate in meniu!\n";
        return out;
}

    
    friend ifstream& operator>>(ifstream& in, Meniu& m) {
    if (in.is_open()) {
        in >> m.nrPrep;
        m.prep = new Preparate[m.nrPrep];
        m.ret = new Retete[m.nrPrep];
        for (int i = 0; i < m.nrPrep; ++i) {
            in >> m.prep[i];
            in >> m.ret[i];
        }

        cout << "Datele au fost citite din fisierul text." << endl;
    } else {
        cerr << "Eroare: Fisierul nu poate fi deschis pentru citire." << endl;
    }
    return in;
}

  void salveazaInFisiserBinar(const char* fileName)
{
    ofstream file(fileName, ios::binary);
    if (file.is_open())
    {
        // Scrie numărul de preparate în fișier
        file.write(reinterpret_cast<char*>(&nrPrep), sizeof(int));

        for (int i = 0; i < nrPrep; ++i)
        {
            // Scrie lungimea numelui preparatului în fișier
            int sz = prep[i].getPreparat(i).size();
            file.write(reinterpret_cast<char*>(&sz), sizeof(int));

            // Scrie numele preparatului în fișier
            file.write(prep[i].getPreparat(i).c_str(), sz);

            // Scrie prețul preparatului în fișier
            float price = prep[i].getPrices(i);
            file.write(reinterpret_cast<char*>(&price), sizeof(float));
        }

        file.close();
        cout << "Datele au fost salvate în fișierul binar." << endl;
    }
    else
    {
        cerr << "Eroare: Fisierul binar nu poate fi deschis pentru scriere." << endl;
    }
}

void scrieCSVMeniu(const string& numeFisier, char separator=',')  {
    ofstream file(numeFisier);
    if (!file.is_open()) {
        cerr << "Fisierul nu poate fi deschis pentru scriere " << numeFisier << endl;
        return;
    }

    file << "Numar preparate, Nume preparat, Pret, Reteta\n";

    if (prep != nullptr && ret != nullptr) {
        for (int i = 0; i < nrPrep; ++i) {
            file << i + 1 << separator << prep->getPreparat(i) << separator << prep->getPrices(i) << separator << ret->getRecipes(i) << "\n";
        }
		file<<endl;
    }

    file.close();
    cout << "Datele au fost scrise in fisierul CSV." << endl;
}
};

class Comenzi {
private:
    const int nrComanda;
    int nrPrep;
    string *prepComandate;
    Preparate **menu;  
    Preparate *present;
    static float totalOrder;

public:
    Comenzi() : nrComanda(0), nrPrep(0), prepComandate(nullptr), menu(nullptr) {}

    Comenzi(Preparate *pre) : nrComanda(0), nrPrep(0),prepComandate(nullptr), menu(nullptr)  {
        this->present = pre;
    }

    Comenzi(const Comenzi &o)
        : nrComanda(o.nrComanda), nrPrep(o.nrPrep), menu(o.menu) {
        this->prepComandate = new string[o.nrPrep];
        for (int i = 0; i < o.nrPrep; i++)
            this->prepComandate[i] = o.prepComandate[i];
    }

    int getNrComanda() const {
        return this->nrComanda;
    }

    int getNrPrepComandate() const {
        return this->nrPrep;
    }

    string getPrepComandate(int index) const {
        if (index >= 0 && index < nrPrep)
            return this->prepComandate[index];
        else
            return "";
    }

    static void calculateTotal(const Comenzi &o) {
        totalOrder = 0;
        for (int i = 0; i < o.nrPrep; i++)
            totalOrder += o.menu[i]->getPrices(i);
    }

    static float getTotalOrder() {
        return totalOrder;
    }

    Comenzi &operator=(const Comenzi &o) {
        if (this != &o) {
            delete[] this->prepComandate;
            this->prepComandate = new string[o.nrPrep];
            for (int i = 0; i < o.nrPrep; i++)
                this->prepComandate[i] = o.prepComandate[i];

            this->menu = o.menu;
            this->nrPrep = o.nrPrep;
        }
        return *this;
    }

    ~Comenzi() {
        delete[] this->prepComandate;
        this->prepComandate = nullptr;
    }

    friend istream &operator>>(istream &in, Comenzi &o) {
        delete[] o.prepComandate;
        o.prepComandate = nullptr;

        cout << "\n--------ISTREAM------------\n";
        cout << "\nNumarul de produse comandate: ";
        in >> o.nrPrep;
        o.prepComandate = new string[o.nrPrep];

        cout << "Produsele comandate::\n";
        for (int i = 0; i < o.nrPrep; i++) {
            cout << "Product " << i + 1 << ": ";
            in >> o.prepComandate[i];

            if (o.present->verificaPreparat(o.prepComandate[i])) {
                cout << "Produsul " << o.prepComandate[i] << "  exista in meniu!.\n";
                o.totalOrder += o.present->getPrices(i);
            } else
                cout << "Produsul " << o.prepComandate[i] << " nu exista in meniu.\n";
        }
        return in;
    }

    friend ostream &operator<<(ostream &out, const Comenzi &o) {
        out << "Numarul comenzii: " << o.nrComanda << "\n";
        out << "Numarul de produse comandate: " << o.nrPrep << "\n";
        out << "Produsele comandate: ";
        if (o.nrPrep > 0 && o.prepComandate != nullptr) {
            for (int i = 0; i < o.nrPrep; ++i) {
                out << o.prepComandate[i] << ", ";
            }
            out << "   - Total: " << totalOrder << " lei\n";
        } else
            out << "Invalid order.\n";
        return out;
    }

    void salveazaInFisierBinar(const string& numeFisier) {
    ofstream file(numeFisier, ios::binary);
    if (file.is_open()) {
        // Scrie numrul de produse comandate în fisier
        file.write(reinterpret_cast<char*>(&nrPrep), sizeof(int));

        // Scrie fiecare produs comandat în fi
        for (int i = 0; i < nrPrep; ++i) {
            // Scrie lungimea numelui preparatului în fișier
            int sz = prepComandate[i].size();
            file.write(reinterpret_cast<char*>(&sz), sizeof(int));

            // Scrie numele preparatului în fișier
            file.write(prepComandate[i].c_str(), sz);
        }

        file.close();
        cout << "Datele au fost salvate in fisierul binar." << endl;
    } else {
        cerr << "Eroare: Fisierul binar nu poate fi deschis pentru scriere." << endl;
    }
}


    friend ofstream& operator<<(ofstream& out, Comenzi& o)
    {
        if (out.is_open()) {
        out << "Numarul comenzii: " << o.nrComanda << "\n";
        out << "Numarul de produse comandate: " << o.nrPrep << "\n";
        out << "Produsele comandate: ";
        if (o.nrPrep > 0 && o.prepComandate != nullptr) {
            for (int i = 0; i < o.nrPrep; ++i) {
                out << o.prepComandate[i] << ", ";
            }
            out << "   - Total: " << totalOrder << " lei\n";
        } else
            out << "Invalid order.\n";
        return out;
    } else {
        cerr << "Fisierul nu poate fi deschis" << endl;

    }
    }

    friend ifstream &operator>>(ifstream& in, Comenzi &o)
    {
        if (in.is_open()) {;
        in >> o.nrPrep;
        o.prepComandate = new string[o.nrPrep];
        for (int i = 0; i < o.nrPrep; ++i) {
            in >> o.prepComandate[i];
        }
        return in;
    } else {
        cerr << "Fisierul nu poate fi deschis" << endl;
    }
    }
};

float Comenzi::totalOrder = Comenzi::getTotalOrder();

class Angajati {
	set<string> numeSet;
	vector<string> nume;
	list<string> numeLista;
	vector<int> varsta;
	vector<string> functie;	
	vector<float> salariu;
	map<string, pair<int, pair<string, float> > > mapaAngajati; //map pentru a stoca informatii referitoare la angajati


public:
     Angajati() {
		cout<<"Constructor implicit"<<endl;
	 }

	 Angajati(const vector<string>& nume, const vector<int>& varsta, const vector<string>& functie, const vector<float>& salariu) {
        if (nume.size() == varsta.size() && varsta.size() == functie.size() && functie.size() == salariu.size()) {
            for (size_t i = 0; i < nume.size(); ++i) {
                adaugaAngajat(nume[i], varsta[i], functie[i], salariu[i]);
            }
        } else {
            cout << "Eroare: Numar inegal de parametri." << endl;
        }
    }

	  Angajati(const Angajati& ang) {
        numeSet = ang.numeSet;
        numeLista = ang.numeLista;
        varsta = ang.varsta;
        functie = ang.functie;
        salariu = ang.salariu;
        mapaAngajati = ang.mapaAngajati;
        cout << "Constructor de copiere" << endl;
    }

    Angajati& operator=(const Angajati& ang) {
        if (this != &ang) {
            numeSet = ang.numeSet;
            numeLista = ang.numeLista;
            varsta = ang.varsta;
            functie = ang.functie;
            salariu = ang.salariu;
            mapaAngajati = ang.mapaAngajati;
        }
        cout << "Operator de atribuire" << endl;
        return *this;
    }

	 void afiseazaTotiAngajatii() {
        for (const auto& angajat : mapaAngajati) {
            cout << "Nume: " << angajat.first << ", Varsta: " << angajat.second.first
                 << ", Job: " << angajat.second.second.first << ", Salariu: " << angajat.second.second.second << endl;
        }
    }

	void afiseazaNumeAngajati() {
        cout << "Numele angajatilor in ordinea adaugarii:" << endl;
        for (const auto& nume : numeLista) {
            cout << nume << endl;
        }
    }

    // Afis informații pentru un angajat 
    void afiseazaInformatiiAngajat(string nume) {
        if (mapaAngajati.find(nume) != mapaAngajati.end()) {
            auto& informatiiAngajat = mapaAngajati[nume];
            cout << "Nume: " << nume << ", Varsta: " << informatiiAngajat.first
                 << ", Job: " << informatiiAngajat.second.first << ", Salariu: " << informatiiAngajat.second.second << endl;
        } else {
            cout << "Angajatul nu a fost găsit." << endl;
        }
    }

    // Actualiz informații pentru un angajat anume
    void actualizeazaInformatiiAngajat(string nume, int nouaVarsta, string nouJob, float nouSalariu) {
        if (mapaAngajati.find(nume) != mapaAngajati.end()) {
            mapaAngajati[nume] = make_pair(nouaVarsta, make_pair(nouJob, nouSalariu));
            cout << "Informațiile angajatului au fost actualizate cu succes." << endl;
        } else {
            cout << "Angajatul nu a fost găsit. Nu se pot actualiza informațiile." << endl;
        }
    }

	void modificaAngajat(const string& numeAngajat) {
        auto it = find(numeLista.begin(), numeLista.end(), numeAngajat);

        if (it != numeLista.end()) {
            // Elimină angajatul din listă
            numeLista.erase(it);

            // Adaugă angajatul la sf listei
            numeLista.push_back(numeAngajat);
            cout << "Angajatul " << numeAngajat << " a fost modificat cu succes." << endl;
        } else {
            cout << "Angajatul nu a fost găsit. Nu s-a putut realiza modificarea." << endl;
        }
    }


	void adaugaAngajat(string nume, int varsta, string functie, float salariu) {
        if (numeSet.find(nume) == numeSet.end()) {
            this->numeSet.insert(nume);
            this->numeLista.push_back(nume);
            this->varsta.push_back(varsta);
            this->functie.push_back(functie);
            this->salariu.push_back(salariu);
            mapaAngajati[nume] = make_pair(varsta, make_pair(functie, salariu));
            cout << "Angajat adăugat cu succes." << endl;
        } else {
            cout << "Numele angajatului există deja. Nu se poate adăuga." << endl;
        }
    }

    void eliminaAngajat(string nume) {
        if (mapaAngajati.find(nume) != mapaAngajati.end()) {
            mapaAngajati.erase(nume);
            cout << "Angajatul a fost eliminat cu succes." << endl;
        } else {
            cout << "Angajatul nu a fost găsit. Nu se poate elimina." << endl;
        }
    }

	float calculeazaMediaSalariilor() {
        if (salariu.empty()) {
            cout << "Nu exista angajati." << endl;
            return 0.0;
        }

        float sumaSalarii = 0.0;
        for (float salariuAngajat : salariu) {
            sumaSalarii += salariuAngajat;
        }

        return sumaSalarii / salariu.size();
    }

	~Angajati() {
        cout << "Destructor" << endl;
	}

	friend istream& operator>>(istream& input, Angajati& angajati) {
        string nume;
        int varsta;
        string functie;
        float salariu;

        cout << "Introduceti informatiile despre angajat (nume varsta functie salariu):" << endl;

        while (input >> nume >> varsta >> functie >> salariu) {
            angajati.adaugaAngajat(nume, varsta, functie, salariu);
        }

        return input;
    }

    friend ostream& operator<<(ostream& output, const Angajati& angajati) {
        output << "Informatii despre angajati:" << endl;
        for (const auto& nume : angajati.numeLista) {
            output << "Nume: " << nume
                   << ", Varsta: " << angajati.mapaAngajati.at(nume).first
                   << ", Functie: " << angajati.mapaAngajati.at(nume).second.first
                   << ", Salariu: " << angajati.mapaAngajati.at(nume).second.second << endl;
        }

        return output;
    }

	friend ofstream& operator<<(ofstream& output, const Angajati& angajati) {
        output << "Informatii despre angajati:" << endl;
        for (const auto& nume : angajati.numeLista) {
            output << "Nume: " << nume
                   << ", Varsta: " << angajati.mapaAngajati.at(nume).first
                   << ", Functie: " << angajati.mapaAngajati.at(nume).second.first
                   << ", Salariu: " << angajati.mapaAngajati.at(nume).second.second << endl;
        }

        return output;
    }

	void scrieInFisier(const string& numeFisier) {
        ofstream fisier(numeFisier);

        if (fisier.is_open()) {
            fisier << *this;
            fisier.close();
            cout << "Angajatii au fost scrisi in fisierul " << numeFisier << endl;
        } else {
            cout << "Eroare la deschiderea fisierului " << numeFisier << endl;
        }
    }
};

int main() 
{
    string ingredientsList[] = {"Faina", "Zahar", "Ou"};
    float stockList[] = {500, 1000, 250};
    Ingrediente ingredients(4, ingredientsList, stockList);
	Ingrediente ing;

    string recipesArray[] = {"Tort", "Clatite", "Tiramisu"};
    int numOfIngredientsArray[] = {3,3,3};
    int durationArray[] = {60, 30, 45};
    Retete recipes(3, ingredientsList, stockList, recipesArray, numOfIngredientsArray, durationArray);
    Retete ret;

    string listaPrep[] = {"Tort", "Clatite", "Tiramisu"};
    float prices[] = {50.0, 20.0, 30.0};
    Preparate preparate(3, listaPrep, &ret, prices);
    Preparate prep;

    Angajati angajati;

    angajati.adaugaAngajat("Eduard", 25, "Manager", 5000.0);
    angajati.adaugaAngajat("Ana", 30, "Bucatar", 4000.0);
    angajati.adaugaAngajat("Ion", 28, "Ospatar", 3300.0);

    //cout << "Obiectul creat explicit:" << endl;
    cout << angajati;

	angajati.adaugaAngajat("Maria", 28, "Ospatar", 3300.0);

	angajati.modificaAngajat("Eduard");

    cout << "Obiectul dupa adaugarea unui angajat suplimentar:" << endl;

	angajati.scrieInFisier("angajati.txt");

	ifstream citireIngrediente("citireIngrediente.txt");
	{
		if (citireIngrediente.is_open()) {
		citireIngrediente >> ing;
		citireIngrediente.close();
	} else {
		cerr << "Fisierul nu poate fi deschis" << endl;
	}
	}

	ing.scrieDinCSV("csv2INGREDIENTE.csv");

	ing.scrieCSV("csvINGREDIENTE.csv");

	ofstream ingrediente("ingrediente.txt");
    {
        if (ingrediente.is_open()) {
        ingrediente << ing;
        ingrediente.close();
    } else {
        cerr << "Fisierul nu poate fi deschis" << endl;
    }
    }

    ifstream inputFile("citireRet.txt");{ // 

    if (!inputFile.is_open()) {
        cerr << "Fisierul nu a fost gasit." << endl;
        return 1;
    }
    }
    inputFile >> ret;

    //ret.citireCSVRet("csv2Ret.csv");
    //cout<<ret;

    inputFile.close();

    ofstream outBinFile("preparate.bin", ios::binary);{
    if (outBinFile.is_open()) {
        ing.scrieBinar(outBinFile);
        outBinFile.close();
    }
    }

	ret.CSVRet("csvRetete.csv");

	ofstream retete("retete.txt");
	{
		if (retete.is_open()) {
		retete << ret;
		retete.close();
	} else {
		cerr << "Fisierul nu poate fi deschis" << endl;
	}
	}

    ret.salveazaInFisierBin("binRetete.bin");

    /*ifstream preparate("citirePrep.txt");{
    if (preparate.is_open()) {
        preparate >> prep;
        preparate.close();
    } else {
        cerr << "Fisierul nu poate fi deschis" << endl;
    }
    }*/

	preparate.salveazaInFisierBinar("binPreparate.bin");

	preparate.scrieCSVPrep("csvPreparate.csv");

	preparate.scrieTXTPrep("txtPreparate.txt");

    Meniu menu(3, &preparate, &ret);

	ofstream meniu("meniu.txt");
    if (meniu.is_open()) {
        meniu << menu;
        meniu.close();
    } else {
        cerr << "Fisierul nu poate fi deschis" << endl;
    }

	menu.scrieCSVMeniu("csvMeniu.csv");

   //menu.salveazaInFisiserBinar("binMeniu.bin");

   Comenzi order(&preparate);
    cin >> order;
    cout << order;

order.salveazaInFisierBinar("binComenzi.bin");

    ofstream comenzi("comenzi.txt");
    {
        if (comenzi.is_open()) {
        comenzi << order;
        comenzi.close();
    } else {
        cerr << "Fisierul nu poate fi deschis" << endl;
    }
    }

    return 0;
}


